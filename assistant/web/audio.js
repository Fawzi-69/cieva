// Capture audio, un canal par locuteur.
//
//   VOUS  micro choisi dans le panneau audio
//   EUX   son du systeme / de l'onglet partage
//
// Chaque canal ouvre son propre contexte a 16 kHz, pousse du PCM au serveur
// par WebSocket, et rend un niveau pour le vu-metre. Separer les deux flux
// des la capture evite d'avoir a deviner ensuite qui a parle.

export const SAMPLE_RATE = 16000;

/* ---------------- appareils ---------------- */

/**
 * Liste les micros. Les libelles ne sont renseignes qu'une fois
 * l'autorisation micro accordee — avant, le navigateur rend des entrees
 * anonymes.
 */
export async function listMicrophones() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices
    .filter((device) => device.kind === 'audioinput')
    .map((device, index) => ({
      deviceId: device.deviceId,
      label: device.label || `Micro ${index + 1}`,
    }));
}

/** Previent quand un appareil est branche ou debranche. */
export function onDeviceChange(handler) {
  navigator.mediaDevices.addEventListener('devicechange', handler);
  return () => navigator.mediaDevices.removeEventListener('devicechange', handler);
}

/* ---------------- flux ---------------- */

export function openMicStream(deviceId) {
  return navigator.mediaDevices.getUserMedia({
    audio: {
      ...(deviceId && deviceId !== 'default' ? { deviceId: { exact: deviceId } } : {}),
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  });
}

export async function openSystemStream() {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    // Pas de traitement : ce flux arrive deja propre, et l'annulation d'echo
    // le degraderait.
    audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
  });

  const audio = stream.getAudioTracks();
  if (!audio.length) {
    stream.getTracks().forEach((track) => track.stop());
    throw new Error(
      'Aucune piste audio partagée. Dans la fenêtre de partage, choisis un onglet et coche « Partager l’audio de l’onglet ».',
    );
  }

  // La video ne sert qu'a obtenir le droit de capturer le son.
  stream.getVideoTracks().forEach((track) => track.stop());
  return stream;
}

/* ---------------- canal ---------------- */

export class AudioChannel {
  #context = null;
  #node = null;
  #source = null;
  #socket = null;
  #stream = null;

  /**
   * @param {object} options
   * @param {'you'|'them'} options.id
   * @param {() => string} options.lang          langue courante, relue a chaque demarrage
   * @param {(text: string) => void} options.onInterim
   * @param {(text: string) => void} options.onFinal
   * @param {(level: number) => void} options.onLevel   0 a 1
   * @param {(message: string) => void} options.onError
   * @param {() => void} options.onEnded         l'utilisateur a coupe le partage
   */
  constructor(options) {
    Object.assign(this, options);
    this.active = false;
  }

  async start(stream) {
    this.#stream = stream;

    // Couper le partage depuis la barre du navigateur doit arreter le canal.
    stream.getAudioTracks()[0]?.addEventListener('ended', () => {
      this.stop();
      this.onEnded?.();
    });

    await this.#openSocket();

    this.#context = new AudioContext({ sampleRate: SAMPLE_RATE });
    await this.#context.audioWorklet.addModule('/pcm-worklet.js');

    this.#source = this.#context.createMediaStreamSource(stream);
    this.#node = new AudioWorkletNode(this.#context, 'pcm-processor');

    this.#node.port.onmessage = ({ data }) => {
      this.onLevel?.(data.level);
      if (this.#socket?.readyState === WebSocket.OPEN) this.#socket.send(data.pcm);
    };

    // Le worklet n'a pas de sortie audible : on le relie quand meme a la
    // destination, sinon certains navigateurs ne le cadencent pas.
    this.#source.connect(this.#node).connect(this.#context.destination);
    this.active = true;
  }

  #openSocket() {
    return new Promise((resolve, reject) => {
      const socket = new WebSocket(`ws://${location.host}/ws/audio`);
      socket.binaryType = 'arraybuffer';
      this.#socket = socket;

      socket.addEventListener('open', () => {
        socket.send(JSON.stringify({ type: 'start', channel: this.id, lang: this.lang() }));
      });

      socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'ready') resolve();
        else if (message.type === 'interim') this.onInterim?.(message.text);
        else if (message.type === 'final') this.onFinal?.(message.text);
        else if (message.type === 'error') {
          this.onError?.(message.message);
          reject(new Error(message.message));
        }
      });

      socket.addEventListener('error', () => reject(new Error('Serveur de transcription injoignable')));
      socket.addEventListener('close', () => {
        if (this.active) this.onError?.('Flux de transcription interrompu');
      });
    });
  }

  stop() {
    this.active = false;

    if (this.#socket?.readyState === WebSocket.OPEN) {
      this.#socket.send(JSON.stringify({ type: 'stop' }));
      this.#socket.close();
    }
    this.#socket = null;

    this.#node?.port.close();
    this.#node?.disconnect();
    this.#source?.disconnect();
    this.#context?.close();
    this.#node = this.#source = this.#context = null;

    this.#stream?.getTracks().forEach((track) => track.stop());
    this.#stream = null;
    this.onLevel?.(0);
  }
}
