import { NextResponse } from 'next/server';

const NO_STORE = {
  'Cache-Control': 'no-store, max-age=0',
  Pragma: 'no-cache',
  'X-Content-Type-Options': 'nosniff',
} as const;

export function jsonResponse(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

export function errorResponse(code: string, message: string, status: number): NextResponse {
  return jsonResponse({ error: { code, message } }, status);
}

/** Only accept JSON posts from this site's own pages. */
export function rejectForeign(request: Request): NextResponse | null {
  const type = request.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase();
  if (type !== 'application/json') return errorResponse('unsupported_media_type', 'Content-Type must be application/json.', 415);
  const origin = request.headers.get('origin');
  const site = request.headers.get('sec-fetch-site');
  let expected = '';
  try {
    expected = new URL(request.url).origin;
  } catch {
    return errorResponse('invalid_origin', 'Request origin is invalid.', 403);
  }
  if (!origin || origin !== expected || (site && site !== 'same-origin')) {
    return errorResponse('invalid_origin', 'Requests must come from this site.', 403);
  }
  return null;
}

const hits = new Map<string, number[]>();

/** Best-effort per-instance limiter; serverless instances do not share memory. */
export function rateLimited(request: Request, bucket: string, limit: number, windowMs: number): NextResponse | null {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'local';
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((at) => now - at < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return errorResponse('rate_limited', 'Too many requests. Wait a few minutes and try again.', 429);
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5_000) {
    for (const [entry, times] of hits) if (!times.some((at) => now - at < windowMs)) hits.delete(entry);
  }
  return null;
}

export class BodyError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
  }
}

export async function readJson(request: Request, maxBytes: number): Promise<unknown> {
  const declared = Number(request.headers.get('content-length') ?? '0');
  if (declared > maxBytes) throw new BodyError('Request body is too large.', 413);
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maxBytes) throw new BodyError('Request body is too large.', 413);
  try {
    return JSON.parse(text);
  } catch {
    throw new BodyError('Request body must be valid JSON.');
  }
}
