import { LIVE_MODEL, SettingsError, buildSystemInstruction, parseSettings, voiceById } from '@/app/lib/live/dpInterview';
import { BodyError, errorResponse, jsonResponse, readJson, rateLimited, rejectForeign } from '@/app/lib/live/serverGuards';

export const dynamic = 'force-dynamic';

const MODEL_PATTERN = /^[a-z0-9][a-z0-9.-]{0,80}$/;
const LOCKED_FIELDS = [
  'model',
  'generationConfig',
  'systemInstruction',
  'realtimeInputConfig',
  'contextWindowCompression',
  'inputAudioTranscription',
  'outputAudioTranscription',
].join(',');

/**
 * Mints a short-lived Gemini Live token for one interview.
 * The DP persona, voice and audio settings are locked into the token on the server,
 * so the browser never sees the API key and cannot change the interviewer's instructions.
 * The browser still controls sessionResumption, which lets it reconnect to the same interview.
 */
export async function POST(request: Request) {
  const foreign = rejectForeign(request);
  if (foreign) return foreign;
  const limited = rateLimited(request, 'live-token', 12, 10 * 60_000);
  if (limited) return limited;

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_LIVE_MODEL?.trim() || LIVE_MODEL;
  if (!apiKey || !MODEL_PATTERN.test(model)) {
    return errorResponse('live_unavailable', 'The live interviewer is not configured on this server.', 503);
  }

  let settings;
  try {
    settings = parseSettings(await readJson(request, 8_192));
  } catch (error) {
    if (error instanceof BodyError) return errorResponse('invalid_request', error.message, error.status);
    if (error instanceof SettingsError) return errorResponse('invalid_settings', error.message, 400);
    throw error;
  }

  const now = Date.now();
  const expiresAt = new Date(now + Math.min(settings.minutes + 25, 90) * 60_000);
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/auth_tokens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
    body: JSON.stringify({
      uses: 1,
      expireTime: expiresAt.toISOString(),
      newSessionExpireTime: new Date(now + 2 * 60_000).toISOString(),
      fieldMask: LOCKED_FIELDS,
      bidiGenerateContentSetup: {
        model: `models/${model}`,
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: settings.voice } } },
        },
        systemInstruction: { parts: [{ text: buildSystemInstruction(settings) }] },
        realtimeInputConfig: {
          automaticActivityDetection: {
            prefixPaddingMs: 300,
            silenceDurationMs: 1000,
            endOfSpeechSensitivity: 'END_SENSITIVITY_LOW',
          },
        },
        inputAudioTranscription: {},
        outputAudioTranscription: {},
        contextWindowCompression: { slidingWindow: {} },
      },
    }),
  }).catch(() => null);

  if (!response?.ok) {
    return errorResponse('live_unavailable', 'Could not start the live interviewer. Please try again in a minute.', 502);
  }
  const payload = (await response.json().catch(() => null)) as { name?: unknown } | null;
  if (!payload || typeof payload.name !== 'string' || !payload.name) {
    return errorResponse('live_unavailable', 'Could not start the live interviewer. Please try again in a minute.', 502);
  }

  const voice = voiceById(settings.voice);
  return jsonResponse({
    token: payload.name,
    model,
    expiresAt: expiresAt.toISOString(),
    interviewer: `${voice.rank} ${voice.name}`,
  });
}
