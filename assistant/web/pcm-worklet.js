// Convertit l'audio en PCM 16 bits et mesure son niveau.
//
// Le contexte audio est cree directement a 16 kHz : le reechantillonnage est
// fait par le navigateur, il n'y a donc rien a interpoler ici. On se contente
// de regrouper les blocs de 128 echantillons en trames de 1024 (64 ms) pour
// ne pas inonder le fil principal de messages.

const FRAME = 1024;

class PcmProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = new Float32Array(FRAME);
    this.filled = 0;
  }

  process(inputs) {
    const channel = inputs[0]?.[0];
    if (!channel) return true;

    for (let i = 0; i < channel.length; i += 1) {
      this.buffer[this.filled] = channel[i];
      this.filled += 1;

      if (this.filled === FRAME) {
        const pcm = new Int16Array(FRAME);
        let sumSquares = 0;

        for (let j = 0; j < FRAME; j += 1) {
          const sample = Math.max(-1, Math.min(1, this.buffer[j]));
          pcm[j] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
          sumSquares += sample * sample;
        }

        this.port.postMessage(
          { pcm: pcm.buffer, level: Math.sqrt(sumSquares / FRAME) },
          [pcm.buffer],
        );
        this.filled = 0;
      }
    }
    return true;
  }
}

registerProcessor('pcm-processor', PcmProcessor);
