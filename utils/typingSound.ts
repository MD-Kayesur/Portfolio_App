import { Platform } from 'react-native';
import { Audio } from 'expo-av';

// Pre-generated high-fidelity mechanical keyboard sound asset
const keyClickAsset = require('@/assets/sounds/keyclick.wav');

class TypingSoundManager {
  private static instance: TypingSoundManager;
  private audioCtx: any = null;
  private nativePool: Audio.Sound[] = [];
  private poolIndex: number = 0;
  private isNativeLoaded: boolean = false;
  private isNativeLoading: boolean = false;
  private readonly POOL_SIZE = 4;

  private constructor() {
    this.init();
  }

  public static getInstance(): TypingSoundManager {
    if (!TypingSoundManager.instance) {
      TypingSoundManager.instance = new TypingSoundManager();
    }
    return TypingSoundManager.instance;
  }

  private async init() {
    if (Platform.OS === 'web') {
      this.initWebAudio();
    } else {
      this.initNativeAudio();
    }
  }

  private initWebAudio() {
    try {
      const AudioCtxClass = (globalThis as any).AudioContext || (globalThis as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  private async initNativeAudio() {
    if (this.isNativeLoaded || this.isNativeLoading) return;
    this.isNativeLoading = true;
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      // Initialize a pool of sounds to allow rapid overlapping keypresses
      for (let i = 0; i < this.POOL_SIZE; i++) {
        const { sound } = await Audio.Sound.createAsync(
          keyClickAsset,
          { shouldPlay: false, volume: 1.0 }
        );
        this.nativePool.push(sound);
      }
      this.isNativeLoaded = true;
    } catch (error) {
      console.warn('Failed to initialize native audio pool:', error);
    } finally {
      this.isNativeLoading = false;
    }
  }

  /**
   * Synthesizes a realistic, tactile mechanical keyboard click on Web
   * using Web Audio API nodes with micro pitch randomization.
   */
  private playWebTypingSound() {
    try {
      if (!this.audioCtx) {
        const AudioCtxClass = (globalThis as any).AudioContext || (globalThis as any).webkitAudioContext;
        if (AudioCtxClass) {
          this.audioCtx = new AudioCtxClass();
        } else {
          return;
        }
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      // Slight pitch variation (±6%) per keystroke for natural feel
      const pitchJitter = 0.94 + Math.random() * 0.12;

      // --- Component 1: Sharp high-frequency click transient ---
      const clickOsc = this.audioCtx.createOscillator();
      const clickGain = this.audioCtx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(3200 * pitchJitter, now);
      clickOsc.frequency.exponentialRampToValueAtTime(800, now + 0.012);

      clickGain.gain.setValueAtTime(0.45, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

      clickOsc.connect(clickGain);
      clickGain.connect(this.audioCtx.destination);

      clickOsc.start(now);
      clickOsc.stop(now + 0.015);

      // --- Component 2: Warm body "thock" resonance ---
      const thockOsc = this.audioCtx.createOscillator();
      const thockGain = this.audioCtx.createGain();
      thockOsc.type = 'sine';
      thockOsc.frequency.setValueAtTime(460 * pitchJitter, now);
      thockOsc.frequency.exponentialRampToValueAtTime(140, now + 0.038);

      thockGain.gain.setValueAtTime(0.55, now);
      thockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      thockOsc.connect(thockGain);
      thockGain.connect(this.audioCtx.destination);

      thockOsc.start(now);
      thockOsc.stop(now + 0.045);

      // --- Component 3: Texture burst (snappy key cap rattle) ---
      const noiseBuffer = this.audioCtx.createBuffer(1, Math.floor(this.audioCtx.sampleRate * 0.008), this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseBuffer.length; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noiseNode = this.audioCtx.createBufferSource();
      noiseNode.buffer = noiseBuffer;

      const noiseFilter = this.audioCtx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(4500 * pitchJitter, now);
      noiseFilter.Q.setValueAtTime(3.0, now);

      const noiseGain = this.audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.3, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.008);

      noiseNode.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.audioCtx.destination);

      noiseNode.start(now);
      noiseNode.stop(now + 0.01);
    } catch (e) {
      console.warn('Error playing web typing sound:', e);
    }
  }

  /**
   * Plays typing sound using the preloaded pool of expo-av Sounds on Native.
   */
  private async playNativeTypingSound() {
    try {
      if (!this.isNativeLoaded && !this.isNativeLoading) {
        await this.initNativeAudio();
      }

      if (this.nativePool.length > 0) {
        const sound = this.nativePool[this.poolIndex];
        this.poolIndex = (this.poolIndex + 1) % this.nativePool.length;

        await sound.replayAsync();
      }
    } catch (err) {
      // Fallback: create single-use sound if pool encountered a glitch
      try {
        const { sound } = await Audio.Sound.createAsync(
          keyClickAsset,
          { shouldPlay: true, volume: 1.0 }
        );
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync();
          }
        });
      } catch (fallbackErr) {
        console.warn('Native typing sound fallback error:', fallbackErr);
      }
    }
  }

  private lastPlayTime: number = 0;

  public play() {
    const now = Date.now();
    if (now - this.lastPlayTime < 25) {
      return;
    }
    this.lastPlayTime = now;

    if (Platform.OS === 'web') {
      this.playWebTypingSound();
    } else {
      this.playNativeTypingSound();
    }
  }

  public unload() {
    if (Platform.OS !== 'web') {
      this.nativePool.forEach((sound) => {
        sound.unloadAsync().catch(() => {});
      });
      this.nativePool = [];
      this.isNativeLoaded = false;
    }
  }
}

export const playTypingSound = () => {
  TypingSoundManager.getInstance().play();
};

export default TypingSoundManager;
