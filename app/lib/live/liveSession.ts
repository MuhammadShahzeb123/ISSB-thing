import { DEBRIEF_PROMPT, KICKOFF_PROMPT, timeCheck, type LiveInterviewSettings } from './dpInterview';

export type Speaker = 'dp' | 'candidate';
/** `debrief` marks the interviewer's spoken feedback after the interview. */
export type TranscriptEntry = { id: number; role: Speaker; text: string; open: boolean; debrief?: boolean };
export type LivePhase = 'connecting' | 'live' | 'reconnecting' | 'debrief' | 'ended' | 'error';

export type LiveCallbacks = {
  onPhase: (phase: LivePhase, detail?: string) => void;
  onTranscript: (entries: TranscriptEntry[]) => void;
  onSpeaker: (speaker: Speaker | null) => void;
  onLevels: (mic: number, dp: number) => void;
  onClock: (seconds: number) => void;
};

const WS_URL =
  'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained';

const BUSY_MESSAGE =
  'The interviewer is busy right now because too many interviews are running at once. Wait a minute, then press Start again. Your transcript so far is saved below.';

type ServerMessage = {
  setupComplete?: object;
  serverContent?: {
    modelTurn?: { parts?: { inlineData?: { data?: string }; text?: string }[] };
    outputTranscription?: { text?: string };
    inputTranscription?: { text?: string };
    interrupted?: boolean;
    turnComplete?: boolean;
  };
  voiceActivity?: { type?: string };
  sessionResumptionUpdate?: { resumable?: boolean; newHandle?: string };
  goAway?: { timeLeft?: string };
};

function micError(error: unknown): string {
  const name = error instanceof DOMException ? error.name : '';
  if (name === 'NotAllowedError' || name === 'SecurityError') {
    return 'Microphone permission was blocked. Allow the microphone for this site in the browser settings, then start again.';
  }
  if (name === 'NotFoundError' || name === 'NotReadableError') {
    return 'No microphone could be used. Check that a mic is connected and not busy in another app.';
  }
  return error instanceof Error && error.message ? error.message : 'The interview could not start. Please try again.';
}

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

function pcmFromBase64(data: string): Float32Array {
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  const pcm = new Int16Array(bytes.buffer, 0, bytes.length >> 1);
  const out = new Float32Array(pcm.length);
  for (let i = 0; i < pcm.length; i += 1) out[i] = pcm[i] / 32768;
  return out;
}

function playbackContext(): AudioContext {
  try {
    return new AudioContext({ sampleRate: 24000, latencyHint: 'interactive' });
  } catch {
    return new AudioContext({ latencyHint: 'interactive' });
  }
}

/**
 * One live Deputy President interview over the Gemini Live API.
 * Owns the microphone, the playback graph and the WebSocket; React only renders what it reports.
 */
export class LiveInterviewSession {
  private readonly settings: LiveInterviewSettings;
  private readonly callbacks: LiveCallbacks;
  private readonly headphones: boolean;

  private token = '';
  private model = '';
  private tokenExpiresAt = 0;
  private ws: WebSocket | null = null;
  private ready = false;
  private handle = '';
  private kickedOff = false;
  private ending = false;
  private goAwayPending = false;
  private failures: number[] = [];

  private micCtx: AudioContext | null = null;
  private playCtx: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private player: AudioWorkletNode | null = null;
  private muted = false;
  private dpSpeaking = false;
  private drainTimer = 0;
  private gateUntil = 0;
  private micLevel = 0;
  private dpLevel = 0;
  private lastLevelAt = 0;

  private entries: TranscriptEntry[] = [];
  private nextId = 1;
  private openDp: TranscriptEntry | null = null;
  private openCandidate: TranscriptEntry | null = null;

  private startedAt = 0;
  private clockTimer = 0;
  private sentWarning = false;
  private sentTimeUp = false;
  private speaker: Speaker | null = null;

  private debriefing = false;
  private debriefQueued = false;
  private debriefAsked = false;
  private debriefDone = false;
  private debriefTimer = 0;

  interviewer = '';

  constructor(settings: LiveInterviewSettings, callbacks: LiveCallbacks, options: { headphones: boolean }) {
    this.settings = settings;
    this.callbacks = callbacks;
    this.headphones = options.headphones;
  }

  /** Call from a click handler so the browser lets audio start. */
  async start(): Promise<void> {
    this.callbacks.onPhase('connecting');
    this.playCtx = playbackContext();
    this.micCtx = new AudioContext({ latencyHint: 'interactive' });
    void this.playCtx.resume();
    void this.micCtx.resume();
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof AudioWorkletNode === 'undefined') {
        throw new Error('This browser cannot run the live interview. Use a recent Chrome, Edge or Safari.');
      }
      const [stream] = await Promise.all([
        navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 },
        }),
        this.playCtx.audioWorklet.addModule('/worklets/pcm-player.js'),
        this.micCtx.audioWorklet.addModule('/worklets/pcm-recorder.js'),
        this.fetchToken(),
      ]);
      if (this.ending) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      this.stream = stream;
      this.wireAudio(stream);
      this.connect();
    } catch (error) {
      this.fail(micError(error));
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (muted) this.send({ realtimeInput: { audioStreamEnd: true } });
  }

  /**
   * Stops the questions and asks the interviewer for his spoken feedback.
   * The microphone stops sending, and the session ends by itself once he has finished speaking.
   */
  requestDebrief() {
    if (this.ending || this.debriefing) return;
    const answered = this.entries.some((entry) => entry.role === 'candidate' && entry.text.trim());
    if (!this.ready || !this.kickedOff || !answered) {
      this.end();
      return;
    }
    this.debriefing = true;
    this.callbacks.onPhase('debrief');
    this.closeCandidate();
    this.send({ realtimeInput: { audioStreamEnd: true } });
    // If he is in the middle of a sentence, let him finish that turn and ask for the feedback straight after it.
    if (this.openDp) this.debriefQueued = true;
    else this.sendDebriefPrompt();
    // Safety net in case the feedback never finishes.
    this.debriefTimer = window.setTimeout(() => this.end(), 150_000);
  }

  private sendDebriefPrompt() {
    this.debriefQueued = false;
    this.debriefAsked = true;
    this.send({ clientContent: { turns: [{ role: 'user', parts: [{ text: DEBRIEF_PROMPT }] }], turnComplete: true } });
  }

  /** The feedback counts as given once he signs off, or has clearly said enough. */
  private debriefGiven(): boolean {
    const text = this.entries
      .filter((entry) => entry.debrief)
      .map((entry) => entry.text)
      .join(' ');
    return /best of luck/i.test(text) || text.split(/\s+/).filter(Boolean).length >= 60;
  }

  /** Ends the interview and releases the microphone. */
  end() {
    if (this.ending) return;
    this.ending = true;
    this.closeDp();
    this.closeCandidate();
    window.clearInterval(this.clockTimer);
    window.clearTimeout(this.drainTimer);
    window.clearTimeout(this.debriefTimer);
    const ws = this.ws;
    this.ws = null;
    if (ws) {
      ws.onclose = null;
      ws.onmessage = null;
      try {
        ws.close(1000, 'interview ended');
      } catch {
        // already closed
      }
    }
    this.stream?.getTracks().forEach((track) => track.stop());
    void this.micCtx?.close().catch(() => undefined);
    void this.playCtx?.close().catch(() => undefined);
    this.setSpeaker(null);
    this.callbacks.onPhase('ended');
  }

  get transcript(): TranscriptEntry[] {
    return this.entries.filter((entry) => entry.text.trim()).map((entry) => ({ ...entry, text: entry.text.trim(), open: false }));
  }

  // ---------- network ----------

  private async fetchToken() {
    const response = await fetch('/api/live-interview/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.settings),
    });
    const data = (await response.json().catch(() => null)) as {
      token?: string;
      model?: string;
      expiresAt?: string;
      interviewer?: string;
      error?: { message?: string };
    } | null;
    if (!response.ok || !data?.token || !data.model) {
      throw new Error(data?.error?.message ?? 'Could not reach the interviewer. Check your internet and try again.');
    }
    this.token = data.token;
    this.model = data.model;
    this.tokenExpiresAt = Date.parse(data.expiresAt ?? '') || Date.now() + 20 * 60_000;
    this.interviewer = data.interviewer ?? '';
  }

  private connect() {
    const ws = new WebSocket(`${WS_URL}?access_token=${encodeURIComponent(this.token)}`);
    ws.binaryType = 'arraybuffer';
    this.ws = ws;
    this.ready = false;
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          setup: { model: `models/${this.model}`, sessionResumption: this.handle ? { handle: this.handle } : {} },
        }),
      );
    };
    ws.onmessage = (event) => {
      if (ws !== this.ws) return;
      const raw = typeof event.data === 'string' ? event.data : new TextDecoder().decode(event.data as ArrayBuffer);
      let message: ServerMessage;
      try {
        message = JSON.parse(raw) as ServerMessage;
      } catch {
        return;
      }
      this.handleMessage(message);
    };
    ws.onclose = (event) => {
      if (ws !== this.ws || this.ending) return;
      this.ws = null;
      this.ready = false;
      void this.recover(event.code, event.reason);
    };
  }

  private send(message: object) {
    if (this.ws && this.ready && this.ws.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(message));
  }

  private async recover(code: number, reason: string) {
    const now = Date.now();
    this.failures = this.failures.filter((at) => now - at < 120_000);
    this.failures.push(now);
    // A quota or capacity refusal is usually brief (another session is still closing), so it earns a few slower retries,
    // each with a fresh single-use token, even before the first resumption handle arrives.
    const busy = code === 1011 && /quota|exhausted|capacity|overloaded|unavailable/i.test(reason);
    // Server hiccups ("Internal error encountered") are worth the same retries.
    const transient = busy || (code === 1011 && /internal|deadline|try again/i.test(reason));
    if (transient ? this.failures.length > 3 : !this.handle || this.failures.length > 5) {
      const why = reason ? ` (${reason})` : '';
      this.fail(busy ? BUSY_MESSAGE : `The connection to the interviewer was lost${why}. Your transcript so far is saved below.`);
      return;
    }
    this.callbacks.onPhase('reconnecting');
    try {
      if (transient || code === 1008 || Date.now() > this.tokenExpiresAt - 60_000) await this.fetchToken();
      await new Promise((resolve) => window.setTimeout(resolve, (transient ? 4000 : 400) * this.failures.length));
      // With nothing to resume, the new session starts empty, so the interviewer begins again.
      if (!this.handle) this.kickedOff = false;
      if (!this.ending) this.connect();
    } catch (error) {
      this.fail(micError(error));
    }
  }

  private reconnectNow() {
    this.goAwayPending = false;
    const old = this.ws;
    this.ws = null;
    this.ready = false;
    if (old) {
      old.onclose = null;
      old.onmessage = null;
      try {
        old.close(1000, 'resume');
      } catch {
        // ignore
      }
    }
    void this.recover(1000, '');
  }

  private handleMessage(message: ServerMessage) {
    if (message.setupComplete) {
      this.ready = true;
      this.failures = [];
      if (this.debriefing) {
        // Reconnected during the feedback: keep what he already said, or ask for it again.
        if (this.debriefGiven()) this.end();
        else this.sendDebriefPrompt();
        return;
      }
      this.callbacks.onPhase('live');
      if (!this.kickedOff) {
        this.kickedOff = true;
        this.send({ clientContent: { turns: [{ role: 'user', parts: [{ text: KICKOFF_PROMPT }] }], turnComplete: true } });
        if (!this.startedAt) this.startClock();
      }
      return;
    }
    if (message.sessionResumptionUpdate?.resumable && message.sessionResumptionUpdate.newHandle) {
      this.handle = message.sessionResumptionUpdate.newHandle;
    }
    if (message.goAway) {
      this.goAwayPending = true;
      const seconds = Number.parseFloat(message.goAway.timeLeft ?? '10') || 10;
      window.setTimeout(() => {
        if (this.goAwayPending && !this.ending) this.reconnectNow();
      }, Math.max(0, seconds * 1000 - 1500));
      if (!this.dpSpeaking) this.reconnectNow();
    }
    if (message.voiceActivity?.type === 'ACTIVITY_START') {
      this.startCandidate();
      if (!this.dpSpeaking || this.headphones) this.setSpeaker('candidate');
    }
    const content = message.serverContent;
    if (!content) return;
    for (const part of content.modelTurn?.parts ?? []) {
      if (part.inlineData?.data) this.play(part.inlineData.data);
    }
    if (content.inputTranscription?.text) this.appendCandidate(content.inputTranscription.text);
    if (content.outputTranscription?.text) this.appendDp(content.outputTranscription.text);
    if (content.interrupted) {
      this.player?.port.postMessage({ type: 'clear' });
      this.closeDp();
      if (this.debriefQueued) this.sendDebriefPrompt();
    }
    if (content.turnComplete) {
      const dpSpoke = Boolean(this.openDp?.text.trim());
      this.closeDp();
      this.closeCandidate();
      if (this.debriefing) {
        if (this.debriefQueued) this.sendDebriefPrompt();
        else if (this.debriefAsked && this.debriefGiven()) {
          this.debriefDone = true;
          // Let the last words play out before closing.
          if (!this.dpSpeaking) this.end();
        }
        return;
      }
      // After time is up, the first finished reply from the interviewer is his closing line.
      if (this.sentTimeUp && dpSpoke) {
        this.requestDebrief();
        return;
      }
      if (this.goAwayPending) this.reconnectNow();
    }
  }

  // ---------- audio ----------

  private wireAudio(stream: MediaStream) {
    const playCtx = this.playCtx!;
    const micCtx = this.micCtx!;
    const player = new AudioWorkletNode(playCtx, 'pcm-player', { processorOptions: { inputRate: 24000 } });
    player.connect(playCtx.destination);
    player.port.onmessage = (event: MessageEvent<{ type: string; level?: number }>) => {
      const data = event.data;
      if (data.type === 'level') {
        this.dpLevel = data.level ?? 0;
        this.reportLevels();
      } else if (data.type === 'started') {
        window.clearTimeout(this.drainTimer);
        this.dpSpeaking = true;
        this.setSpeaker('dp');
      } else if (data.type === 'drained') {
        window.clearTimeout(this.drainTimer);
        this.drainTimer = window.setTimeout(() => {
          this.dpSpeaking = false;
          this.gateUntil = Date.now() + 350;
          if (this.speaker === 'dp') this.setSpeaker(null);
          if (this.debriefDone) this.end();
          else if (this.goAwayPending) this.reconnectNow();
        }, 300);
      }
    };
    this.player = player;

    const source = micCtx.createMediaStreamSource(stream);
    const recorder = new AudioWorkletNode(micCtx, 'pcm-recorder', { processorOptions: { targetRate: 16000 } });
    const sink = micCtx.createGain();
    sink.gain.value = 0;
    source.connect(recorder);
    recorder.connect(sink);
    sink.connect(micCtx.destination);
    recorder.port.onmessage = (event: MessageEvent<{ pcm: ArrayBuffer; level: number }>) => {
      const gated = this.debriefing || (!this.headphones && (this.dpSpeaking || Date.now() < this.gateUntil));
      this.micLevel = this.muted || gated ? 0 : event.data.level;
      this.reportLevels();
      if (this.muted || gated) return;
      this.send({ realtimeInput: { audio: { data: toBase64(event.data.pcm), mimeType: 'audio/pcm;rate=16000' } } });
    };
  }

  private play(data: string) {
    const samples = pcmFromBase64(data);
    this.player?.port.postMessage({ type: 'push', samples: samples.buffer }, [samples.buffer]);
  }

  private reportLevels() {
    const now = performance.now();
    if (now - this.lastLevelAt < 80) return;
    this.lastLevelAt = now;
    this.callbacks.onLevels(this.micLevel, this.dpLevel);
  }

  private setSpeaker(speaker: Speaker | null) {
    if (this.speaker === speaker) return;
    this.speaker = speaker;
    this.callbacks.onSpeaker(speaker);
  }

  // ---------- transcript ----------

  private emit() {
    this.callbacks.onTranscript(this.entries.map((entry) => ({ ...entry })));
  }

  private appendDp(text: string) {
    if (!this.openDp) {
      this.openDp = { id: this.nextId++, role: 'dp', text: '', open: true, debrief: this.debriefAsked };
      this.entries.push(this.openDp);
    }
    this.openDp.text += text;
    this.emit();
  }

  private closeDp() {
    if (!this.openDp) return;
    this.openDp.open = false;
    this.openDp.text = this.openDp.text.trim();
    this.openDp = null;
    this.emit();
  }

  private startCandidate() {
    if (this.openCandidate) return;
    this.openCandidate = { id: this.nextId++, role: 'candidate', text: '', open: true };
    this.entries.push(this.openCandidate);
  }

  private appendCandidate(text: string) {
    this.startCandidate();
    this.openCandidate!.text += text;
    this.emit();
  }

  private closeCandidate() {
    const entry = this.openCandidate;
    if (!entry) return;
    this.openCandidate = null;
    entry.open = false;
    entry.text = entry.text.trim();
    if (!entry.text) this.entries = this.entries.filter((item) => item !== entry);
    this.emit();
  }

  // ---------- clock ----------

  private startClock() {
    this.startedAt = Date.now();
    this.clockTimer = window.setInterval(() => {
      const seconds = Math.floor((Date.now() - this.startedAt) / 1000);
      this.callbacks.onClock(seconds);
      const total = this.settings.minutes * 60;
      if (!this.sentWarning && seconds >= total - 180) {
        this.sentWarning = true;
        this.note(timeCheck(3));
      }
      if (!this.sentTimeUp && seconds >= total) {
        this.sentTimeUp = true;
        this.note(timeCheck(0));
      }
      // If the closing never comes (a long answer, a quiet room), move to the feedback anyway.
      if (seconds >= total + 90) this.requestDebrief();
    }, 1000);
  }

  private note(text: string) {
    this.send({ clientContent: { turns: [{ role: 'user', parts: [{ text }] }], turnComplete: false } });
  }

  private fail(message: string) {
    this.end();
    this.callbacks.onPhase('error', message);
  }
}
