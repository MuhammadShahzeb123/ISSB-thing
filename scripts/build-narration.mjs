/**
 * Build spoken scripts (no dashes/colons) + espeak-ng WAV/MP3 for:
 * - GK topics
 * - Nishan-e-Haider martyrs
 * - GTO outdoor obstacles (+ indoor overview)
 * - Psychological overview / story-writing intros
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { createRequire } from 'module';

const root = process.cwd();
const require = createRequire(import.meta.url);

function toSpokenProse(...parts) {
  const joined = parts
    .filter((p) => p && String(p).trim())
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  let t = joined
    .replace(/\bRemember:\s*/gi, 'Remember ')
    .replace(/[–—−]/g, ' ')
    .replace(/:/g, ',')
    .replace(/\s-\s/g, ' ')
    .replace(/(\w)-(\w)/g, '$1 $2')
    .replace(/\//g, ' or ')
    .replace(/[•·]/g, ' ')
    .replace(/\([^)]*\)/g, (m) => ` ${m.slice(1, -1)} `)
    .replace(/[{}[\]]/g, ' ')
    .replace(/[;]/g, ',')
    .replace(/\s+,/g, ',')
    .replace(/,{2,}/g, ',')
    .replace(/,\s*\./g, '.')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+\./g, '.')
    .trim();
  t = t.replace(/[:–—−-]/g, ' ').replace(/\s{2,}/g, ' ').trim();
  if (!t) return '';
  if (!/[.!?]$/.test(t)) t += '.';
  return t;
}

function assertClean(script, label) {
  if (/[:–—−-]/.test(script)) {
    throw new Error(`Bad spoken prose (${label}): still has dash/colon → ${script.slice(0, 100)}`);
  }
}

function extractArrayLiteral(src, exportName) {
  const marker = `export const ${exportName}`;
  const i = src.indexOf(marker);
  if (i < 0) throw new Error(`Missing ${exportName}`);
  const eq = src.indexOf('=', i);
  const start = src.indexOf('[', eq);
  let depth = 0;
  for (let j = start; j < src.length; j++) {
    const c = src[j];
    if (c === '[') depth++;
    else if (c === ']') {
      depth--;
      if (depth === 0) return src.slice(start, j + 1);
    }
  }
  throw new Error(`Unclosed array for ${exportName}`);
}

function parseTopics(src) {
  // Lightweight field extraction for top-level topic objects
  const topics = [];
  const re = /\{\s*id:\s*'([^']+)',\s*category:\s*'([^']+)',\s*title:\s*'((?:\\'|[^'])*)',\s*teaser:\s*'((?:\\'|[^'])*)',\s*summary:\s*'((?:\\'|[^'])*)',([\s\S]*?)remember:\s*'((?:\\'|[^'])*)',\s*whyIssb:\s*'((?:\\'|[^'])*)'/g;
  let m;
  while ((m = re.exec(src))) {
    const id = m[1];
    // skip nested aircraft ids (they appear with role: not category at topic level - our regex requires category)
    const keyPointsBlock = m[6].match(/keyPoints:\s*\[([\s\S]*?)\],/);
    const points = [];
    if (keyPointsBlock) {
      const pr = /'((?:\\'|[^'])*)'/g;
      let pm;
      while ((pm = pr.exec(keyPointsBlock[1]))) points.push(pm[1].replace(/\\'/g, "'"));
    }
    topics.push({
      id,
      category: m[2],
      title: m[3].replace(/\\'/g, "'"),
      teaser: m[4].replace(/\\'/g, "'"),
      summary: m[5].replace(/\\'/g, "'"),
      keyPoints: points,
      remember: m[7].replace(/\\'/g, "'"),
      whyIssb: m[8].replace(/\\'/g, "'"),
    });
  }
  return topics;
}

function parseMartyrs(src) {
  const stories = [];
  const blocks = src.split(/\n  \{\n/).slice(1);
  for (const block of blocks) {
    const id = block.match(/id:\s*'([^']+)'/)?.[1];
    const name = block.match(/name:\s*'([^']+)'/)?.[1];
    const rank = block.match(/rank:\s*'([^']+)'/)?.[1];
    const story = block.match(/story:\s*((?:'[^']*')|(?:"[^"]*")|(?:`[^`]*`))/)?.[1];
    if (!id || !story) continue;
    const quote = story[0];
    const raw = story.slice(1, -1).replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, ' ');
    stories.push({ id, name, rank, story: raw });
  }
  return stories;
}

function parseObstacles(src) {
  const list = [];
  const re = /id:\s*'([^']+)',\s*name:\s*'((?:\\'|[^'])*)',\s*summary:\s*'((?:\\'|[^'])*)'/g;
  let m;
  while ((m = re.exec(src))) {
    list.push({ id: m[1], name: m[2].replace(/\\'/g, "'"), summary: m[3].replace(/\\'/g, "'") });
  }
  // also pull step tips for richer narration
  return list.map((o) => {
    const start = src.indexOf(`id: '${o.id}'`);
    const next = src.indexOf("\n  {\n    id:", start + 5);
    const chunk = src.slice(start, next > 0 ? next : start + 2500);
    const tips = [...chunk.matchAll(/tip:\s*'((?:\\'|[^'])*)'/g)].map((x) => x[1].replace(/\\'/g, "'"));
    return { ...o, tips };
  });
}

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

function synthesize(text, outMp3) {
  const wav = outMp3.replace(/\.mp3$/, '.wav');
  ensureDir(path.dirname(outMp3));
  const tmpTxt = outMp3.replace(/\.mp3$/, '.txt');
  fs.writeFileSync(tmpTxt, text, 'utf8');
  execFileSync('espeak-ng', ['-v', 'en-gb', '-s', '145', '-p', '45', '-w', wav, '-f', tmpTxt], {
    stdio: ['ignore', 'ignore', 'pipe'],
  });
  execFileSync(
    'ffmpeg',
    ['-y', '-i', wav, '-codec:a', 'libmp3lame', '-qscale:a', '6', outMp3],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  );
  fs.unlinkSync(wav);
  // keep .txt script next to mp3 for inspection
  return outMp3;
}

const manifest = [];

// —— GK ——
const gkSrc = fs.readFileSync(path.join(root, 'app/lib/gkTopics.ts'), 'utf8');
const topics = parseTopics(gkSrc);
console.log('GK topics parsed:', topics.length);
ensureDir(path.join(root, 'public/audio/gk'));
ensureDir(path.join(root, 'public/audio/scripts/gk'));

const gkSpoken = {};
for (const t of topics) {
  const script = toSpokenProse(
    t.title,
    t.summary,
    pointsToProse(t.keyPoints),
    `Remember ${t.remember}`,
    `Why interviewers ask this. ${t.whyIssb}`,
  );
  assertClean(script, t.id);
  gkSpoken[t.id] = script;
  const mp3 = path.join(root, `public/audio/gk/${t.id}.mp3`);
  synthesize(script, mp3);
  fs.writeFileSync(path.join(root, `public/audio/scripts/gk/${t.id}.txt`), script);
  manifest.push({ section: 'general-knowledge', id: t.id, title: t.title, audio: `/audio/gk/${t.id}.mp3` });
  console.log('GK audio', t.id);
}

function pointsToProse(points) {
  if (!points?.length) return '';
  return points.map((p, i) => (i === 0 ? p : p)).join(' Next, ');
}

// —— Martyrs ——
const msSrc = fs.readFileSync(path.join(root, 'app/lib/militaryStories.ts'), 'utf8');
const martyrs = parseMartyrs(msSrc);
console.log('Martyrs parsed:', martyrs.length);
ensureDir(path.join(root, 'public/audio/martyrs'));
ensureDir(path.join(root, 'public/audio/scripts/martyrs'));
const martyrSpoken = {};
for (const s of martyrs) {
  const script = toSpokenProse(`${s.rank} ${s.name}.`, s.story);
  assertClean(script, s.id);
  martyrSpoken[s.id] = script;
  synthesize(script, path.join(root, `public/audio/martyrs/${s.id}.mp3`));
  fs.writeFileSync(path.join(root, `public/audio/scripts/martyrs/${s.id}.txt`), script);
  manifest.push({ section: 'nishan-e-haider', id: s.id, title: `${s.rank} ${s.name}`, audio: `/audio/martyrs/${s.id}.mp3` });
  console.log('Martyr audio', s.id);
}

// —— GTO outdoor ——
const obsSrc = fs.readFileSync(path.join(root, 'app/gto/outdoor/obstacles.tsx'), 'utf8');
const obstacles = parseObstacles(obsSrc);
console.log('Obstacles parsed:', obstacles.length);
ensureDir(path.join(root, 'public/audio/gto'));
ensureDir(path.join(root, 'public/audio/scripts/gto'));
const gtoSpoken = {};
for (const o of obstacles) {
  const script = toSpokenProse(
    `Outdoor obstacle. ${o.name}.`,
    o.summary,
    o.tips?.length ? `Here is the technique step by step. ${o.tips.join(' Then, ')}` : '',
  );
  assertClean(script, o.id);
  gtoSpoken[o.id] = script;
  synthesize(script, path.join(root, `public/audio/gto/${o.id}.mp3`));
  fs.writeFileSync(path.join(root, `public/audio/scripts/gto/${o.id}.txt`), script);
  manifest.push({ section: 'gto-outdoor', id: o.id, title: o.name, audio: `/audio/gto/${o.id}.mp3` });
  console.log('GTO audio', o.id);
}

// Indoor GTO overview
{
  const id = 'indoor-overview';
  const script = toSpokenProse(
    'Indoor Group Testing Officer practice.',
    'Here you prepare for discussion motions, short lectures, and planning problems.',
    'Pick a topic, outline your points in plain language, then practise speaking for the timed window.',
    'Debate motions are prompts for reasoned opinion, not established facts.',
    'For planning tasks, list the given facts, name what is missing, and build a conditional plan rather than inventing numbers.',
  );
  assertClean(script, id);
  gtoSpoken[id] = script;
  synthesize(script, path.join(root, `public/audio/gto/${id}.mp3`));
  fs.writeFileSync(path.join(root, `public/audio/scripts/gto/${id}.txt`), script);
  manifest.push({ section: 'gto-indoor', id, title: 'Indoor practice overview', audio: `/audio/gto/${id}.mp3` });
}

// —— Psychological ——
ensureDir(path.join(root, 'public/audio/psychological'));
ensureDir(path.join(root, 'public/audio/scripts/psychological'));
const psychSpoken = {};
const psychPieces = [
  {
    id: 'overview',
    title: 'Psychological tests overview',
    text: toSpokenProse(
      'Psychological tests practice.',
      'This dimension covers word association, picture stories, sentence completion, and related writing drills.',
      'Timed sessions use fixed deadlines and save drafts automatically.',
      'Official format facts shown inside each simulator are limited to details published on the ISSB Selection System page.',
      'App specific prompt counts, content, timing choices, and interactions are practice methodology, not a prediction of the real board.',
    ),
  },
  {
    id: 'wat-overview',
    title: 'Word association overview',
    text: toSpokenProse(
      'Word association test practice.',
      'You see a word and write the first natural response that comes to mind.',
      'Keep answers short, honest, and consistent with how you actually think.',
      'Do not rehearse a fake personality.',
    ),
  },
  {
    id: 'sentence-completion-overview',
    title: 'Sentence completion overview',
    text: toSpokenProse(
      'Sentence completion practice.',
      'Finish each unfinished sentence with a clear, realistic ending in your own words.',
      'Focus on attitude, responsibility, and practical problem solving rather than slogans.',
    ),
  },
  {
    id: 'story-writing-overview',
    title: 'Story writing overview',
    text: toSpokenProse(
      'Story writing practice.',
      'You observe a picture or opening line, then write a complete story with a beginning, middle, and end.',
      'The practice pictures are original illustrations for this site, not official ISSB stimuli.',
      'Like the real test they are deliberately ambiguous, so you decide what happened and how it ends.',
    ),
  },
];

// Add story picture alts as narrations
const storySrc = fs.readFileSync(path.join(root, 'app/content/psychological-tests/story-writing.ts'), 'utf8');
const alts = [...storySrc.matchAll(/id:\s*"([^"]+)"[\s\S]*?alt:\s*"([^"]+)"/g)];
for (const [, id, alt] of alts) {
  psychPieces.push({
    id,
    title: id,
    text: toSpokenProse('Picture story prompt.', alt, 'Observe carefully, then write what you see happening and how it ends.'),
  });
}

for (const p of psychPieces) {
  assertClean(p.text, p.id);
  psychSpoken[p.id] = p.text;
  synthesize(p.text, path.join(root, `public/audio/psychological/${p.id}.mp3`));
  fs.writeFileSync(path.join(root, `public/audio/scripts/psychological/${p.id}.txt`), p.text);
  manifest.push({ section: 'psychological', id: p.id, title: p.title, audio: `/audio/psychological/${p.id}.mp3` });
  console.log('Psych audio', p.id);
}

// Write narration index module used by the app
const indexTs = `/* Auto-generated by scripts/build-narration.mjs — do not edit by hand */
export type NarrationEntry = {
  section: string;
  id: string;
  title: string;
  audio: string;
  script: string;
};

export const gkNarration: Record<string, { audio: string; script: string }> = ${JSON.stringify(
  Object.fromEntries(topics.map((t) => [t.id, { audio: `/audio/gk/${t.id}.mp3`, script: gkSpoken[t.id] }])),
  null,
  2,
)} as const;

export const martyrNarration: Record<string, { audio: string; script: string }> = ${JSON.stringify(
  Object.fromEntries(martyrs.map((s) => [s.id, { audio: `/audio/martyrs/${s.id}.mp3`, script: martyrSpoken[s.id] }])),
  null,
  2,
)} as const;

export const gtoNarration: Record<string, { audio: string; script: string }> = ${JSON.stringify(
  Object.fromEntries(Object.entries(gtoSpoken).map(([id, script]) => [id, { audio: `/audio/gto/${id}.mp3`, script }])),
  null,
  2,
)} as const;

export const psychNarration: Record<string, { audio: string; script: string }> = ${JSON.stringify(
  Object.fromEntries(Object.entries(psychSpoken).map(([id, script]) => [id, { audio: `/audio/psychological/${id}.mp3`, script }])),
  null,
  2,
)} as const;

export const narrationManifest = ${JSON.stringify(manifest, null, 2)} as const;
`;

fs.writeFileSync(path.join(root, 'app/lib/narrationCatalog.ts'), indexTs);
fs.writeFileSync(path.join(root, 'public/audio/manifest.json'), JSON.stringify(manifest, null, 2));

// Patch militaryStories spokenScript fields to cleaned versions
let msOut = msSrc;
for (const s of martyrs) {
  const clean = martyrSpoken[s.id];
  const esc = clean.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  if (msOut.includes(`spokenScript:`)) {
    msOut = msOut.replace(
      new RegExp(`(id:\\s*'${s.id}'[\\s\\S]*?spokenScript:\\s*)"[^"]*"`),
      `$1"${esc}"`,
    );
  }
}
fs.writeFileSync(path.join(root, 'app/lib/militaryStories.ts'), msOut);

console.log('\nDONE. Audio files:', manifest.length);
console.log(JSON.stringify(Object.groupBy ? null : '', ));
const by = {};
for (const m of manifest) by[m.section] = (by[m.section] || 0) + 1;
console.log(by);
