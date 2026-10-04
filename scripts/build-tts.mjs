/**
 * Narration builder using Gemini voices.
 *
 *   npm run narration                      # build anything whose script changed
 *   npm run narration -- --only=gk,affairs # limit sections (gk, affairs, gto, psych)
 *   npm run narration -- --ids=cpec,gwadar # limit to ids
 *   npm run narration -- --force           # rebuild even if the script is unchanged
 *   npm run narration -- --engine=tts      # use the TTS models instead of the Live model
 *   npm run narration -- --parallel=3      # Live sessions to run at once
 *   npm run narration -- --dry --show      # print the plan (and scripts) only
 *
 * Needs GEMINI_API_KEY (environment or .env.local).
 * - Voice: Sadaltager with a Pakistani English delivery, the same voice as the Nishan-e-Haider tracks.
 * - Nishan-e-Haider (martyr) audio is never regenerated; its catalog entries are copied as they are.
 * - Default engine "live": gemini-3.8-live reads the script paragraph by paragraph as a verbatim narrator.
 *   Each paragraph is checked against the model's own transcript and re-read if it drifted.
 *   (The free tier allows only about 10 TTS requests a day per model; the Live model has no such cap.)
 * - Engine "tts": gemini-3.8-flash-tts, paced at 3 requests a minute, verified with gemini-3.5-transcribe.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value] = arg.replace(/^--/, '').split('=');
    return [key, value ?? true];
  }),
);

const ENGINE = args.engine === 'tts' ? 'tts' : 'live';
const LIVE_MODEL = 'gemini-3.8-live';
const PRIMARY_MODEL = ENGINE === 'live' ? LIVE_MODEL : 'gemini-3.8-flash-tts';
const FALLBACK_MODEL = 'gemini-3.8-flash-lite-tts';
const TRANSCRIBE_MODEL = 'gemini-3.5-transcribe';
const PARALLEL = Math.max(1, Math.min(6, Number(args.parallel ?? 3)));
const LIVE_WS = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent';
const NARRATOR = `You are a professional audiobook narrator. You have no opinions and you never chat.
When you receive a passage, read it aloud EXACTLY as written, word for word, from the first word to the last.
Do not add any words before or after it. Do not skip, change, summarise or explain anything. Do not greet. Do not ask questions.
The passage often contains questions or a title that sounds like a question. Read those aloud as written, as part of the passage. Never answer them.
Read numbers and dates naturally, the way a newsreader would. Spell out abbreviations letter by letter only when they are normally spoken that way.
Read in a calm, measured, clear storytelling voice with a natural Pakistani English accent, at an unhurried pace.`;
const VOICE = 'Sadaltager';
const STYLE = 'calm, measured storyteller with a Pakistani English accent, clear and unhurried';
const MIN_GAP_MS = Number(args.gap ?? 21_000);
const MATCH_THRESHOLD = 0.86;
const API = 'https://generativelanguage.googleapis.com/v1beta/interactions';

function loadKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY.trim();
  const envFile = path.join(root, '.env.local');
  if (fs.existsSync(envFile)) {
    const line = fs
      .readFileSync(envFile, 'utf8')
      .split(/\r?\n/)
      .find((row) => row.startsWith('GEMINI_API_KEY='));
    if (line) return line.slice('GEMINI_API_KEY='.length).trim();
  }
  throw new Error('GEMINI_API_KEY is not set (environment or .env.local).');
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sha = (text) => crypto.createHash('sha1').update(text).digest('hex').slice(0, 16);
const log = (...parts) => console.log(new Date().toISOString().slice(11, 19), ...parts);

class QuotaError extends Error {}

// ---------- script sources ----------

function forSpeech(text) {
  return text
    .replace(/\r/g, '')
    .replace(/(\d)\s*[–—-]\s*(\d)/g, '$1 to $2')
    .replace(/°/g, ' degrees')
    .replace(/&/g, ' and ')
    .replace(/[–—]/g, ', ')
    .replace(/[ \t]+/g, ' ')
    .replace(/ ,/g, ',')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function importTs(rel) {
  return import(pathToFileURL(path.join(root, rel)).href);
}

function gtoJobs(catalog) {
  const src = fs.readFileSync(path.join(root, 'app/gto/outdoor/obstacles.tsx'), 'utf8');
  const jobs = [];
  const re = /id:\s*'([^']+)',\s*name:\s*'((?:\\'|[^'])*)',\s*summary:\s*'((?:\\'|[^'])*)'/g;
  let match;
  while ((match = re.exec(src))) {
    const [, id, rawName, rawSummary] = match;
    const start = match.index;
    const next = src.indexOf("\n  id: '", start + 10);
    const chunk = src.slice(start, next > 0 ? next : start + 4000);
    const steps = [...chunk.matchAll(/title:\s*'((?:\\'|[^'])*)',\s*tip:\s*'((?:\\'|[^'])*)'/g)].map((m) => ({
      title: m[1].replace(/\\'/g, "'"),
      tip: m[2].replace(/\\'/g, "'"),
    }));
    const name = rawName.replace(/\\'/g, "'").replace(/\s*\(([^)]+)\)/, ', the $1');
    const summary = rawSummary.replace(/\\'/g, "'");
    const stepText = steps.map((step, index) => `Step ${index + 1}. ${step.title}. ${step.tip}`).join('\n\n');
    jobs.push({
      section: 'gto',
      dir: 'gto',
      id,
      title: name,
      script: forSpeech(`Outdoor obstacle. ${name}.\n\n${summary}\n\nHere is the technique, step by step.\n\n${stepText}`),
    });
  }
  const indoor = catalog.gtoNarration['indoor-overview'];
  if (indoor) {
    jobs.push({ section: 'gto', dir: 'gto', id: 'indoor-overview', title: 'Indoor practice overview', script: forSpeech(indoor.script) });
  }
  return jobs;
}

function psychJobs(catalog) {
  return Object.entries(catalog.psychNarration).map(([id, entry]) => ({
    section: 'psych',
    dir: 'psychological',
    id,
    title: id,
    script: forSpeech(entry.script),
  }));
}

function gkJobs(gkTopics) {
  return gkTopics.map((topic) => ({
    section: 'gk',
    dir: 'gk',
    id: topic.id,
    title: topic.title,
    script: forSpeech(`${topic.title}.\n\n${topic.summary}\n\nRemember. ${topic.remember}`),
  }));
}

function affairsJobs(stories) {
  return stories.map((story) => ({
    section: 'affairs',
    dir: 'affairs',
    id: story.id,
    title: story.title,
    script: forSpeech(`${story.title}.\n\n${story.story}\n\nPoints to remember.\n\n${story.keyFacts.join('\n')}`),
  }));
}

// ---------- Gemini calls ----------

let lastRequestAt = 0;
async function pace() {
  const wait = lastRequestAt + MIN_GAP_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastRequestAt = Date.now();
}

function retrySeconds(body, headers) {
  const header = Number(headers.get('retry-after'));
  if (Number.isFinite(header) && header > 0) return header + 1;
  const found = /retry in ([\d.]+)s/i.exec(body);
  return found ? Math.ceil(Number(found[1])) + 1 : null;
}

async function callInteractions(key, payload, label, { paced }) {
  for (let attempt = 1; attempt <= 8; attempt += 1) {
    if (paced) await pace();
    let res;
    try {
      res = await fetch(API, {
        method: 'POST',
        headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(240_000),
      });
    } catch (error) {
      log(`${label}: network error (${error.message}), retrying`);
      await sleep(10_000 * attempt);
      continue;
    }
    if (res.ok) return res.json();
    const body = await res.text();
    if (res.status === 429 && /per day|daily|RPD/i.test(body)) throw new QuotaError(body.slice(0, 300));
    if (res.status === 429 || res.status >= 500) {
      const wait = retrySeconds(body, res.headers) ?? Math.min(90, 15 * attempt);
      log(`${label}: HTTP ${res.status}, retry ${attempt} in ${wait}s`);
      await sleep(wait * 1000);
      continue;
    }
    throw new Error(`${label}: HTTP ${res.status} ${body.slice(0, 400)}`);
  }
  throw new Error(`${label}: gave up after repeated errors`);
}

function outputOf(json, type) {
  return (json.steps ?? [])
    .filter((step) => step.type === 'model_output')
    .flatMap((step) => step.content ?? [])
    .filter((content) => content.type === type);
}

async function synthesize(key, model, text, label) {
  const json = await callInteractions(
    key,
    {
      model,
      input: [{ type: 'user_input', content: [{ type: 'text', text, annotations: [{ type: 'speech_metadata', style: STYLE }] }] }],
      response_format: { type: 'audio', mime_type: 'audio/l16', sample_rate: 24000 },
      generation_config: { speech_config: [{ voice: VOICE }] },
    },
    label,
    { paced: true },
  );
  const audio = outputOf(json, 'audio').at(-1);
  if (!audio?.data) throw new Error(`${label}: no audio in response`);
  return Buffer.from(audio.data, 'base64');
}

async function transcribe(key, mp3, label) {
  const json = await callInteractions(
    key,
    {
      model: TRANSCRIBE_MODEL,
      input: [{ type: 'audio', data: mp3.toString('base64'), mime_type: 'audio/mp3' }],
      generation_config: { transcription_config: { language_codes: ['en-US'] } },
    },
    `${label} transcribe`,
    { paced: false },
  );
  return outputOf(json, 'text')
    .map((content) => content.text)
    .join(' ');
}

// ---------- audio + verification ----------

const NUMBER_WORDS = new Set(
  'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred thousand million billion trillion point first second third fourth fifth sixth seventh eighth ninth tenth'.split(
    ' ',
  ),
);

/** Normalised words; any run of digits or number words becomes one "#" so "2026" matches "twenty twenty six". */
function words(text) {
  const raw = text
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
  const out = [];
  for (const word of raw) {
    const isNumber = /^\d/.test(word) || NUMBER_WORDS.has(word) || (word === 'and' && out.at(-1) === '#');
    if (isNumber) {
      if (out.at(-1) !== '#') out.push('#');
    } else {
      out.push(word);
    }
  }
  return out;
}

function editDistance(a, b) {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i += 1) {
    const curr = [i];
    for (let j = 1; j <= b.length; j += 1) curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = curr;
  }
  return prev[b.length];
}

/** Same word, or a close spelling of a longer word (names come back spelled many ways). */
function sameWord(a, b) {
  if (a === b) return true;
  if (a.length < 5 || b.length < 5 || Math.abs(a.length - b.length) > 3) return false;
  return editDistance(a, b) <= Math.floor(Math.max(a.length, b.length) / 3);
}

function matchRatio(script, heard) {
  const a = words(script);
  const b = words(heard);
  if (!a.length || !b.length) return 0;
  let prev = new Uint16Array(b.length + 1);
  let curr = new Uint16Array(b.length + 1);
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      curr[j] = sameWord(a[i - 1], b[j - 1]) ? prev[j - 1] + 1 : Math.max(prev[j], curr[j - 1]);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[b.length] / Math.max(a.length, b.length);
}

function pcmToMp3(pcm, outFile) {
  const tmp = path.join(os.tmpdir(), `issb-tts-${process.pid}-${Date.now()}.pcm`);
  fs.writeFileSync(tmp, pcm);
  try {
    execFileSync(
      'ffmpeg',
      ['-v', 'error', '-y', '-f', 's16le', '-ar', '24000', '-ac', '1', '-i', tmp, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '24000', '-ac', '1', '-b:a', '64k', outFile],
      { stdio: ['ignore', 'ignore', 'pipe'] },
    );
  } finally {
    fs.rmSync(tmp, { force: true });
  }
  return fs.readFileSync(outFile);
}

function splitInTwo(script) {
  const paragraphs = script.split(/\n\n+/);
  if (paragraphs.length < 2) {
    const mid = script.indexOf('. ', Math.floor(script.length / 2));
    return mid > 0 ? [script.slice(0, mid + 1), script.slice(mid + 2)] : [script];
  }
  let total = 0;
  const half = script.length / 2;
  const first = [];
  for (const paragraph of paragraphs) {
    if (total > half && first.length) break;
    first.push(paragraph);
    total += paragraph.length;
  }
  return [first.join('\n\n'), paragraphs.slice(first.length).join('\n\n')].filter(Boolean);
}

const pause = Buffer.alloc(24000 * 2 * 0.6);

// ---------- Live narrator ----------

class LiveNarrator {
  constructor(key, label) {
    this.key = key;
    this.label = label;
    this.ws = null;
    this.turn = null;
  }

  open() {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(`${LIVE_WS}?key=${encodeURIComponent(this.key)}`);
      ws.binaryType = 'arraybuffer';
      this.ws = ws;
      const timer = setTimeout(() => reject(new Error('Live setup timed out')), 30_000);
      ws.onopen = () =>
        ws.send(
          JSON.stringify({
            setup: {
              model: `models/${LIVE_MODEL}`,
              generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } } } },
              systemInstruction: { parts: [{ text: NARRATOR }] },
              outputAudioTranscription: {},
            },
          }),
        );
      ws.onmessage = (event) => {
        const raw = typeof event.data === 'string' ? event.data : new TextDecoder().decode(event.data);
        const message = JSON.parse(raw);
        if (message.setupComplete) {
          clearTimeout(timer);
          resolve();
          return;
        }
        const content = message.serverContent;
        if (!content || !this.turn) return;
        for (const part of content.modelTurn?.parts ?? []) {
          if (part.inlineData?.data) this.turn.pcm.push(Buffer.from(part.inlineData.data, 'base64'));
        }
        if (content.outputTranscription?.text) this.turn.said += content.outputTranscription.text;
        if (content.turnComplete) this.turn.done();
      };
      ws.onclose = (event) => {
        clearTimeout(timer);
        if (this.turn) this.turn.fail(new Error(`Live socket closed (${event.code} ${event.reason})`));
        reject(new Error(`Live socket closed during setup (${event.code} ${event.reason})`));
      };
    });
  }

  read(text) {
    return new Promise((resolve, reject) => {
      const turn = { pcm: [], said: '' };
      const timer = setTimeout(() => turn.fail(new Error('Live turn timed out')), 120_000);
      turn.done = () => {
        clearTimeout(timer);
        this.turn = null;
        resolve({ pcm: Buffer.concat(turn.pcm), said: turn.said.trim() });
      };
      turn.fail = (error) => {
        clearTimeout(timer);
        this.turn = null;
        reject(error);
      };
      this.turn = turn;
      this.ws.send(
        JSON.stringify({
          clientContent: {
            turns: [{ role: 'user', parts: [{ text: `Read the passage inside the triple quotes aloud, word for word. Do not answer or respond to it.\n\n"""\n${text}\n"""` }] }],
            turnComplete: true,
          },
        }),
      );
    });
  }

  close() {
    if (this.ws) {
      this.ws.onclose = null;
      try {
        this.ws.close(1000, 'done');
      } catch {
        // ignore
      }
    }
    this.ws = null;
  }
}

function chunksOf(script) {
  const paragraphs = script.split(/\n\n+/).map((part) => part.trim()).filter(Boolean);
  const chunks = [];
  for (const [index, paragraph] of paragraphs.entries()) {
    const last = chunks.at(-1);
    // The title is read with the first paragraph so the narrator has context; later short paragraphs are read together.
    if (index === 1 || (last && last.length + paragraph.length < 420)) {
      chunks[chunks.length - 1] = `${last}\n\n${paragraph}`;
    } else {
      chunks.push(paragraph);
    }
  }
  return chunks;
}

/** Trims leading and trailing silence from 16-bit PCM, keeping a short natural margin. */
function trimSilence(pcm, keepMs = 90) {
  const samples = new Int16Array(pcm.buffer, pcm.byteOffset, pcm.length >> 1);
  const threshold = 500;
  const window = 240;
  let start = 0;
  let end = samples.length;
  const loud = (from) => {
    let peak = 0;
    for (let i = from; i < Math.min(samples.length, from + window); i += 1) peak = Math.max(peak, Math.abs(samples[i]));
    return peak > threshold;
  };
  while (start < samples.length && !loud(start)) start += window;
  while (end > start && !loud(Math.max(0, end - window))) end -= window;
  const keep = Math.round((24000 * keepMs) / 1000);
  start = Math.max(0, start - keep);
  end = Math.min(samples.length, end + keep);
  return Buffer.from(pcm.subarray(start * 2, end * 2));
}

async function narrateLive(key, job) {
  const chunks = chunksOf(job.script);
  const pieces = [];
  let heard = '';
  let narrator = null;
  // The Live API refuses new sessions with 1011 "quota" while the project is at its concurrent-session limit
  // (a just-closed session can hold its slot for a few seconds), so opening waits and retries.
  const reopen = async () => {
    narrator?.close();
    for (let attempt = 1; ; attempt += 1) {
      narrator = new LiveNarrator(key, job.id);
      try {
        await narrator.open();
        return;
      } catch (error) {
        narrator.close();
        if (!/quota|exhausted|1011/i.test(error.message) || attempt >= 8) throw error;
        const wait = Math.min(60, 8 * attempt);
        log(`${job.section}/${job.id}: Live is at its session quota, retrying in ${wait}s`);
        await sleep(wait * 1000);
      }
    }
  };
  try {
    await reopen();
    for (const [index, chunk] of chunks.entries()) {
      let best = null;
      for (let attempt = 1; attempt <= 4; attempt += 1) {
        let result;
        try {
          result = await narrator.read(chunk);
        } catch (error) {
          log(`${job.section}/${job.id}: chunk ${index + 1} ${error.message}, reopening`);
          await sleep(1500 * attempt);
          await reopen();
          continue;
        }
        const match = matchRatio(chunk, result.said);
        if (!best || match > best.match) best = { ...result, match };
        if (match >= 0.9 && result.pcm.length > 24000) break;
        log(`${job.section}/${job.id}: chunk ${index + 1} drifted (match ${match.toFixed(2)}), re-reading`);
        // A fresh session forgets the drift.
        await reopen();
      }
      if (!best || best.match < 0.85) throw new Error(`chunk ${index + 1} could not be read verbatim (best match ${best?.match.toFixed(2) ?? 'none'})`);
      pieces.push(trimSilence(best.pcm));
      heard += ` ${best.said}`;
    }
  } finally {
    narrator?.close();
  }
  const gap = Buffer.alloc(Math.round(24000 * 2 * 0.5));
  const pcm = Buffer.concat(pieces.flatMap((piece, index) => (index ? [gap, piece] : [piece])));
  return { pcm, heard: heard.trim() };
}

async function buildOneLive(key, job) {
  const outFile = path.join(root, 'public/audio', job.dir, `${job.id}.mp3`);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  const { pcm, heard } = await narrateLive(key, job);
  const mp3 = pcmToMp3(pcm, outFile);
  const seconds = pcm.length / 2 / 24000;
  let match = matchRatio(job.script, heard);
  if (args.verify) {
    try {
      match = matchRatio(job.script, await transcribe(key, mp3, `${job.section}/${job.id}`));
    } catch (error) {
      log(`${job.section}/${job.id}: external verification skipped (${error.message.slice(0, 120)})`);
    }
  }
  log(`${job.section}/${job.id}: ${seconds.toFixed(0)}s audio, match ${match.toFixed(3)}`);
  return { mp3, seconds, match };
}

async function buildOne(key, job, model) {
  const outFile = path.join(root, 'public/audio', job.dir, `${job.id}.mp3`);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  const attempts = [[job.script], [job.script], splitInTwo(job.script)];
  let best = null;
  for (const [index, pieces] of attempts.entries()) {
    const pcm = [];
    for (const [part, text] of pieces.entries()) {
      if (part) pcm.push(pause);
      pcm.push(await synthesize(key, model, text, `${job.section}/${job.id}${pieces.length > 1 ? ` part ${part + 1}` : ''}`));
    }
    const mp3 = pcmToMp3(Buffer.concat(pcm), outFile);
    const seconds = Buffer.concat(pcm).length / 2 / 24000;
    let match = null;
    try {
      match = matchRatio(job.script, await transcribe(key, mp3, `${job.section}/${job.id}`));
    } catch (error) {
      log(`${job.section}/${job.id}: verification skipped (${error.message.slice(0, 120)})`);
    }
    log(`${job.section}/${job.id}: ${seconds.toFixed(0)}s audio, match ${match === null ? 'n/a' : match.toFixed(3)} (try ${index + 1})`);
    if (!best || (match ?? 0) > (best.match ?? 0)) best = { mp3, seconds, match };
    if (match === null || match >= MATCH_THRESHOLD) break;
  }
  fs.writeFileSync(outFile, best.mp3);
  return best;
}

// ---------- catalog ----------

function writeCatalog(catalog, entries) {
  const pick = (section) =>
    Object.fromEntries(
      entries.filter((entry) => entry.section === section).map((entry) => [entry.id, { audio: entry.audio, script: entry.script }]),
    );
  const block = (name, value) =>
    `export const ${name}: Record<string, { audio: string; script: string }> = ${JSON.stringify(value, null, 2)} as const;\n`;
  const ts = `/* Auto-generated by scripts/build-tts.mjs. Do not edit by hand. */
export type NarrationEntry = {
  section: string;
  id: string;
  title: string;
  audio: string;
  script: string;
};

${block('gkNarration', pick('gk'))}
${block('affairsNarration', pick('affairs'))}
${block('martyrNarration', catalog.martyrNarration)}
${block('gtoNarration', pick('gto'))}
${block('psychNarration', pick('psych'))}`;
  fs.writeFileSync(path.join(root, 'app/lib/narrationCatalog.ts'), ts);
}

// ---------- main ----------

async function main() {
  const key = loadKey();
  const catalog = await importTs('app/lib/narrationCatalog.ts');
  const { gkTopics } = await importTs('app/lib/gkTopics.ts');
  // Same order as app/lib/affairsStories.ts (Node cannot resolve its extensionless imports).
  const affairsStories = [];
  for (const [file, name] of [
    ['app/lib/affairs/pakistan.ts', 'pakistanStories'],
    ['app/lib/affairs/neighbours.ts', 'neighbourStories'],
    ['app/lib/affairs/world.ts', 'worldStories'],
  ]) {
    if (fs.existsSync(path.join(root, file))) affairsStories.push(...(await importTs(file))[name]);
  }

  const all = [...affairsJobs(affairsStories), ...gkJobs(gkTopics), ...gtoJobs(catalog), ...psychJobs(catalog)];
  const manifestFile = path.join(root, 'public/audio/manifest.json');
  const previous = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile, 'utf8')) : [];
  const prevById = new Map(previous.map((entry) => [`${entry.section}/${entry.id}`, entry]));

  const only = typeof args.only === 'string' ? new Set(args.only.split(',')) : null;
  const ids = typeof args.ids === 'string' ? new Set(args.ids.split(',')) : null;
  const signature = (job, model) => sha(`${model}|${VOICE}|${STYLE}|${job.script}`);

  // Identical scripts share one recording.
  const firstByScript = new Map();
  const todo = [];
  for (const job of all) {
    job.audio = `/audio/${job.dir}/${job.id}.mp3`;
    const file = path.join(root, 'public', job.audio);
    const prev = prevById.get(`${job.section}/${job.id}`);
    const wanted = (!only || only.has(job.section)) && (!ids || ids.has(job.id));
    const fresh =
      prev && fs.existsSync(file) && (prev.sha === signature(job, prev.model) && (!args.upgrade || prev.model === PRIMARY_MODEL));
    job.prev = prev;
    if (wanted && (args.force || !fresh)) {
      const twin = firstByScript.get(job.script);
      if (twin) job.copyOf = twin;
      else firstByScript.set(job.script, job);
      todo.push(job);
    }
  }

  log(`${all.length} narration items, ${todo.length} to build${args.dry ? ' (dry run)' : ''}.`);
  for (const job of todo) {
    log(`  - ${job.section}/${job.id}${job.copyOf ? ` (copy of ${job.copyOf.id})` : ''} ${job.script.length} chars`);
    if (args.show) console.log(`${job.script}\n`);
  }
  if (args.dry) return;

  let model = typeof args.model === 'string' ? args.model : PRIMARY_MODEL;
  const results = new Map();
  const failed = [];
  if (ENGINE === 'live') {
    const queue = todo.filter((job) => !job.copyOf);
    const tries = new Map();
    const worker = async () => {
      for (let job = queue.shift(); job; job = queue.shift()) {
        try {
          results.set(job, { ...(await buildOneLive(key, job)), model: LIVE_MODEL });
          saveState();
        } catch (error) {
          const attempt = (tries.get(job) ?? 0) + 1;
          tries.set(job, attempt);
          if (attempt < 3) {
            log(`${job.section}/${job.id}: ${error.message.slice(0, 160)}; re-queued (attempt ${attempt})`);
            queue.push(job);
            await sleep(15_000);
          } else {
            failed.push(job.id);
            log(`FAILED ${job.section}/${job.id}: ${error.message.slice(0, 300)}`);
          }
        }
      }
    };
    await Promise.all(Array.from({ length: PARALLEL }, worker));
  } else {
    for (const job of todo) {
      if (job.copyOf) continue;
      try {
        results.set(job, { ...(await buildOne(key, job, model)), model });
      } catch (error) {
        if (error instanceof QuotaError && model !== FALLBACK_MODEL) {
          log(`Daily quota reached for ${model}. Switching to ${FALLBACK_MODEL}.`);
          model = FALLBACK_MODEL;
          results.set(job, { ...(await buildOne(key, job, model)), model });
        } else {
          failed.push(job.id);
          log(`FAILED ${job.section}/${job.id}: ${error.message.slice(0, 300)}`);
          break;
        }
      }
      saveState();
    }
  }
  for (const job of todo) {
    if (!job.copyOf || !results.has(job.copyOf)) continue;
    fs.copyFileSync(path.join(root, 'public', job.copyOf.audio), path.join(root, 'public', job.audio));
    results.set(job, results.get(job.copyOf));
  }
  saveState();

  function saveState() {
    const manifest = all.map((job) => {
      const done = results.get(job);
      const base = { section: job.section, id: job.id, title: job.title, audio: job.audio };
      if (done) return { ...base, sha: signature(job, done.model), model: done.model, seconds: Math.round(done.seconds), match: done.match === null ? null : Number(done.match.toFixed(3)) };
      return job.prev ? { ...base, sha: job.prev.sha, model: job.prev.model, seconds: job.prev.seconds, match: job.prev.match } : base;
    });
    fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
    for (const job of all) {
      if (!results.has(job)) continue;
      const scriptDir = path.join(root, 'public/audio/scripts', job.dir);
      fs.mkdirSync(scriptDir, { recursive: true });
      fs.writeFileSync(path.join(scriptDir, `${job.id}.txt`), job.script);
      fs.writeFileSync(path.join(root, 'public/audio', job.dir, `${job.id}.txt`), job.script);
    }
    writeCatalog(catalog, all.map((job) => ({ section: job.section, id: job.id, audio: job.audio, script: job.script })));
  }

  const built = [...results.values()];
  const weak = [...results.entries()].filter(([, r]) => r.match !== null && r.match < MATCH_THRESHOLD).map(([job]) => job.id);
  log(`Done. Built ${built.length}/${todo.length}. Weak matches: ${weak.length ? weak.join(', ') : 'none'}. Failed: ${failed.length ? failed.join(', ') : 'none'}.`);
  if (failed.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
