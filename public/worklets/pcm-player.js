/**
 * Gapless playback of the interviewer's 24 kHz PCM stream.
 * Samples are queued in a ring buffer and resampled to the context rate.
 * "clear" drops everything instantly (used when the candidate interrupts).
 */
class PcmPlayer extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.inputRate = (options && options.processorOptions && options.processorOptions.inputRate) || 24000;
    this.step = this.inputRate / sampleRate;
    this.capacity = this.inputRate * 180;
    this.ring = new Float32Array(this.capacity);
    this.write = 0;
    this.read = 0;
    this.active = false;
    this.energy = 0;
    this.count = 0;
    this.port.onmessage = (event) => {
      const data = event.data;
      if (data.type === 'push') {
        const samples = new Float32Array(data.samples);
        for (let i = 0; i < samples.length; i++) {
          this.ring[this.write % this.capacity] = samples[i];
          this.write++;
        }
        if (this.write - this.read > this.capacity) this.read = this.write - this.capacity;
      } else if (data.type === 'clear') {
        this.read = this.write;
      }
    };
  }

  process(_inputs, outputs) {
    const output = outputs[0];
    const channel = output[0];
    for (let i = 0; i < channel.length; i++) {
      const available = this.write - this.read;
      let value = 0;
      if (available >= 1) {
        const index = Math.floor(this.read);
        const frac = this.read - index;
        const a = this.ring[index % this.capacity];
        const b = index + 1 < this.write ? this.ring[(index + 1) % this.capacity] : a;
        value = a + (b - a) * frac;
        this.read += this.step;
        if (this.read > this.write) this.read = this.write;
      }
      channel[i] = value;
      this.energy += value * value;
      this.count++;
    }
    for (let c = 1; c < output.length; c++) output[c].set(channel);

    const playing = this.write - this.read >= 1;
    if (playing !== this.active) {
      this.active = playing;
      this.port.postMessage({ type: playing ? 'started' : 'drained' });
    }
    if (this.count >= sampleRate / 20) {
      this.port.postMessage({ type: 'level', level: Math.sqrt(this.energy / this.count) });
      this.energy = 0;
      this.count = 0;
    }
    return true;
  }
}

registerProcessor('pcm-player', PcmPlayer);
