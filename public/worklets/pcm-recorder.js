/**
 * Microphone capture for the live interview.
 * Downsamples whatever rate the AudioContext runs at to 16 kHz mono,
 * converts to 16-bit PCM and posts 40 ms chunks with an RMS level.
 */
class PcmRecorder extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.targetRate = (options && options.processorOptions && options.processorOptions.targetRate) || 16000;
    this.ratio = sampleRate / this.targetRate;
    this.pending = new Float32Array(0);
    this.pos = 0;
    this.chunk = new Int16Array(Math.round(this.targetRate * 0.04));
    this.fill = 0;
    this.energy = 0;
  }

  emit(sample) {
    const s = sample > 1 ? 1 : sample < -1 ? -1 : sample;
    this.chunk[this.fill++] = s < 0 ? s * 0x8000 : s * 0x7fff;
    this.energy += s * s;
    if (this.fill === this.chunk.length) {
      const out = this.chunk.slice(0);
      const level = Math.sqrt(this.energy / this.chunk.length);
      this.port.postMessage({ pcm: out.buffer, level }, [out.buffer]);
      this.fill = 0;
      this.energy = 0;
    }
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input.length || !input[0]) return true;
    const frames = input[0].length;
    const merged = new Float32Array(this.pending.length + frames);
    merged.set(this.pending);
    for (let i = 0; i < frames; i++) {
      let sum = 0;
      for (let c = 0; c < input.length; c++) sum += input[c][i];
      merged[this.pending.length + i] = sum / input.length;
    }

    let pos = this.pos;
    if (this.ratio >= 1) {
      // Box-filter decimation: average the input samples that fall inside each output sample.
      while (pos + this.ratio <= merged.length) {
        const start = Math.floor(pos);
        const end = Math.max(start + 1, Math.floor(pos + this.ratio));
        let sum = 0;
        for (let k = start; k < end; k++) sum += merged[k];
        this.emit(sum / (end - start));
        pos += this.ratio;
      }
    } else {
      while (pos + 1 < merged.length) {
        const i = Math.floor(pos);
        const frac = pos - i;
        this.emit(merged[i] + (merged[i + 1] - merged[i]) * frac);
        pos += this.ratio;
      }
    }
    const consumed = Math.floor(pos);
    this.pending = merged.slice(consumed);
    this.pos = pos - consumed;
    return true;
  }
}

registerProcessor('pcm-recorder', PcmRecorder);
