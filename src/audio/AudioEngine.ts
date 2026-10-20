// Procedural Web Audio Engine for ECHOES OF THE CROWD
// Completely original, synthetic procedural audio with zero copyrighted assets.

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private isInitialized: boolean = false;

  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;

  private masterVolume: number = 0.8;
  private sfxVolume: number = 0.8;
  private musicVolume: number = 0.6;
  private ambientVolume: number = 0.5;

  private ambientRunning: boolean = false;
  private ambientFilter: BiquadFilterNode | null = null;
  private tensionDroneGain: GainNode | null = null;
  private tensionDroneOsc: OscillatorNode | null = null;
  private harmonyGain: GainNode | null = null;
  private harmonyOsc: OscillatorNode | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  public init(): void {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.ambientVolume, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      this.isInitialized = true;
      this.startAmbient();
    } catch (e) {
      console.warn('AudioContext failed to initialize:', e);
    }
  }

  public setVolumes(master: number, sfx: number, music: number, ambient: number): void {
    this.masterVolume = Math.max(0, Math.min(1, master));
    this.sfxVolume = Math.max(0, Math.min(1, sfx));
    this.musicVolume = Math.max(0, Math.min(1, music));
    this.ambientVolume = Math.max(0, Math.min(1, ambient));

    if (this.ctx && this.masterGain && this.sfxGain && this.musicGain && this.ambientGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setTargetAtTime(this.masterVolume, now, 0.05);
      this.sfxGain.gain.setTargetAtTime(this.sfxVolume, now, 0.05);
      this.musicGain.gain.setTargetAtTime(this.musicVolume, now, 0.05);
      this.ambientGain.gain.setTargetAtTime(this.ambientVolume, now, 0.05);
    }
  }

  // --- Sound Effects ---

  /** Camera Mechanical Shutter Click + Film Advance */
  public playShutter(): void {
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    // 1. Initial spring slap (noise click)
    const bufferSize = this.ctx.sampleRate * 0.05;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2800, now);
    filter.Q.setValueAtTime(3.0, now);

    const clickGain = this.ctx.createGain();
    clickGain.gain.setValueAtTime(0.8, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    whiteNoise.connect(filter);
    filter.connect(clickGain);
    clickGain.connect(this.sfxGain);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.05);

    // 2. Mechanical shutter metallic tone
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.08);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.7, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.09);

    // 3. Film ratchet sound after 120ms
    setTimeout(() => {
      if (!this.ctx || !this.sfxGain) return;
      const t = this.ctx.currentTime;
      const ratOsc = this.ctx.createOscillator();
      ratOsc.type = 'sawtooth';
      ratOsc.frequency.setValueAtTime(180, t);
      ratOsc.frequency.linearRampToValueAtTime(320, t + 0.06);

      const ratGain = this.ctx.createGain();
      ratGain.gain.setValueAtTime(0.3, t);
      ratGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      ratOsc.connect(ratGain);
      ratGain.connect(this.sfxGain);
      ratOsc.start(t);
      ratOsc.stop(t + 0.07);
    }, 120);
  }

  /** Camera Flash high-pitch charging whine */
  public playFlash(): void {
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(4200, now + 0.35);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.36);
  }

  /** Subtle UI hover chime */
  public playUIHover(): void {
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(780, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  /** UI Click tactile feedback */
  public playUIClick(): void {
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.05);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  /** News Broadcast Fanfare / Monolith Screen Chime */
  public playBroadcastAlert(): void {
    if (!this.ctx || !this.sfxGain) return;
    const notes = [440, 554.37, 659.25, 880]; // A major arpeggio
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const startTime = this.ctx.currentTime + idx * 0.07;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  /** Footstep thud with pan */
  public playFootstep(panFactor: number = 0): void {
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.06);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    let finalNode: AudioNode = gain;
    if (this.ctx.createStereoPanner) {
      const panner = this.ctx.createStereoPanner();
      panner.pan.setValueAtTime(Math.max(-1, Math.min(1, panFactor)), now);
      gain.connect(panner);
      finalNode = panner;
    }

    osc.connect(gain);
    finalNode.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  /** Subtle procedural vocal babble / reaction sound */
  public playVocalReaction(emotion: string): void {
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';

    const gain = this.ctx.createGain();

    if (emotion === 'happy') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.12);
      filter.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    } else if (emotion === 'angry') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(210, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);
      filter.frequency.setValueAtTime(650, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    } else if (emotion === 'surprised') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(820, now + 0.1);
      filter.frequency.setValueAtTime(1600, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    } else {
      // neutral / murmur
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(340, now + 0.08);
      filter.frequency.setValueAtTime(900, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    }

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  // --- Dynamic Procedural City Ambience & Musical Score ---

  private startAmbient(): void {
    if (!this.ctx || !this.ambientGain || !this.musicGain || this.ambientRunning) return;
    this.ambientRunning = true;

    // 1. Filtered pink-like noise bed for urban street air & distant traffic
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const data = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2) * 0.12;
    }

    const noiseSrc = this.ctx.createBufferSource();
    noiseSrc.buffer = noiseBuffer;
    noiseSrc.loop = true;

    this.ambientFilter = this.ctx.createBiquadFilter();
    this.ambientFilter.type = 'lowpass';
    this.ambientFilter.frequency.setValueAtTime(450, this.ctx.currentTime);

    noiseSrc.connect(this.ambientFilter);
    this.ambientFilter.connect(this.ambientGain);
    noiseSrc.start();

    // 2. Tension drone oscillator (sub-bass dark drone, modulated by social tension)
    this.tensionDroneOsc = this.ctx.createOscillator();
    this.tensionDroneOsc.type = 'sawtooth';
    this.tensionDroneOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // low A1

    const tensionFilter = this.ctx.createBiquadFilter();
    tensionFilter.type = 'lowpass';
    tensionFilter.frequency.setValueAtTime(140, this.ctx.currentTime);

    this.tensionDroneGain = this.ctx.createGain();
    this.tensionDroneGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

    this.tensionDroneOsc.connect(tensionFilter);
    tensionFilter.connect(this.tensionDroneGain);
    this.tensionDroneGain.connect(this.musicGain);
    this.tensionDroneOsc.start();

    // 3. Empathy Harmony oscillator (warm, warm fifth pad)
    this.harmonyOsc = this.ctx.createOscillator();
    this.harmonyOsc.type = 'sine';
    this.harmonyOsc.frequency.setValueAtTime(220, this.ctx.currentTime); // A3

    this.harmonyGain = this.ctx.createGain();
    this.harmonyGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    this.harmonyOsc.connect(this.harmonyGain);
    this.harmonyGain.connect(this.musicGain);
    this.harmonyOsc.start();
  }

  /**
   * Adapts procedural soundtrack stems to live city metrics.
   * @param tension 0 - 100
   * @param empathy 0 - 100
   */
  public updateAtmosphere(tension: number, empathy: number): void {
    if (!this.ctx || !this.tensionDroneGain || !this.harmonyGain || !this.ambientFilter) return;
    const now = this.ctx.currentTime;

    // Tension drone increases in presence & filter opens as tension approaches 100
    const tensionNorm = Math.max(0, Math.min(1, tension / 100));
    const tensionVol = tensionNorm > 0.35 ? (tensionNorm - 0.35) * 0.4 : 0.001;
    this.tensionDroneGain.gain.setTargetAtTime(tensionVol, now, 0.4);

    // Filter opens up as city gets busier/chaotic
    const targetFreq = 350 + tensionNorm * 600;
    this.ambientFilter.frequency.setTargetAtTime(targetFreq, now, 0.5);

    // Harmony pad swells as empathy rises
    const empathyNorm = Math.max(0, Math.min(1, empathy / 100));
    const harmonyVol = 0.04 + empathyNorm * 0.22;
    this.harmonyGain.gain.setTargetAtTime(harmonyVol, now, 0.4);
  }
}

export const sound = new AudioEngine();
