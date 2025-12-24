import { useRef, useCallback, useEffect, useState } from 'react';

interface AudioEngineState {
  isPlaying: boolean;
  frequency: number;
  isOverloaded: boolean;
}

export const useAudioEngine = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);
  const lfoGainRef = useRef<GainNode | null>(null);
  const noiseGainRef = useRef<GainNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  
  // Sound effect refs
  const dustSoundTimeoutRef = useRef<number | null>(null);
  const idleSoundIntervalRef = useRef<number | null>(null);
  
  const [state, setState] = useState<AudioEngineState>({
    isPlaying: false,
    frequency: 0.5,
    isOverloaded: false,
  });

  const createNoiseBuffer = useCallback((context: AudioContext, type: 'white' | 'pink' | 'brown' = 'white') => {
    const bufferSize = context.sampleRate * 2;
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = buffer.getChannelData(0);
    
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      
      if (type === 'white') {
        output[i] = white * 0.5;
      } else if (type === 'pink') {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      } else {
        output[i] = (b0 = (b0 + (0.02 * white)) / 1.02) * 3.5;
      }
    }
    
    return buffer;
  }, []);

  // Fun dust cleaning sound - whoosh/brush effect
  const playDustCleanSound = useCallback(() => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    
    // Create a quick whoosh/brush sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    // Random pitch for variety
    const basePitch = 200 + Math.random() * 300;
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(basePitch, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(basePitch * 0.3, ctx.currentTime + 0.15);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  }, []);

  // Idle sound - gentle wind/breath
  const playIdleSound = useCallback(() => {
    if (!audioContextRef.current || !state.isPlaying) return;
    
    const ctx = audioContextRef.current;
    
    // Create gentle breath/sigh sound
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc.type = 'sine';
    osc2.type = 'sine';
    
    const pitch = 80 + Math.random() * 40;
    osc.frequency.setValueAtTime(pitch, ctx.currentTime);
    osc2.frequency.setValueAtTime(pitch * 1.5, ctx.currentTime);
    
    osc.frequency.linearRampToValueAtTime(pitch * 0.8, ctx.currentTime + 2);
    osc2.frequency.linearRampToValueAtTime(pitch * 1.2, ctx.currentTime + 2);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, ctx.currentTime);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.5);
    gain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 1.5);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
    
    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 2);
    osc2.stop(ctx.currentTime + 2);
  }, [state.isPlaying]);

  // Crack repair sound - glass/crystal ping
  const playCrackRepairSound = useCallback(() => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc2.type = 'triangle';
    
    const pitch = 800 + Math.random() * 400;
    osc.frequency.setValueAtTime(pitch, ctx.currentTime);
    osc2.frequency.setValueAtTime(pitch * 2.5, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    
    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
    osc2.stop(ctx.currentTime + 0.5);
  }, []);

  // BOOM explosion sound when dust is full
  const playDustExplosionSound = useCallback(() => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    
    // Deep boom bass
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(80, ctx.currentTime);
    bassOsc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.8);
    bassGain.gain.setValueAtTime(0.4, ctx.currentTime);
    bassGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    bassOsc.connect(bassGain);
    bassGain.connect(ctx.destination);
    bassOsc.start(ctx.currentTime);
    bassOsc.stop(ctx.currentTime + 0.8);

    // Mid crackle/explosion
    const midOsc = ctx.createOscillator();
    const midGain = ctx.createGain();
    const midFilter = ctx.createBiquadFilter();
    midOsc.type = 'sawtooth';
    midOsc.frequency.setValueAtTime(200, ctx.currentTime);
    midOsc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.5);
    midFilter.type = 'lowpass';
    midFilter.frequency.setValueAtTime(1500, ctx.currentTime);
    midFilter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
    midGain.gain.setValueAtTime(0.25, ctx.currentTime);
    midGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    midOsc.connect(midFilter);
    midFilter.connect(midGain);
    midGain.connect(ctx.destination);
    midOsc.start(ctx.currentTime);
    midOsc.stop(ctx.currentTime + 0.5);

    // White noise burst for explosion texture
    const noiseBuffer = createNoiseBuffer(ctx, 'white');
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    const noiseGain = ctx.createGain();
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(500, ctx.currentTime);
    noiseFilter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
    noiseGain.gain.setValueAtTime(0.3, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSource.start(ctx.currentTime);
    noiseSource.stop(ctx.currentTime + 0.4);

    // High frequency sizzle
    const highOsc = ctx.createOscillator();
    const highGain = ctx.createGain();
    highOsc.type = 'square';
    highOsc.frequency.setValueAtTime(2000, ctx.currentTime);
    highOsc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.15);
    highGain.gain.setValueAtTime(0.08, ctx.currentTime);
    highGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    highOsc.connect(highGain);
    highGain.connect(ctx.destination);
    highOsc.start(ctx.currentTime);
    highOsc.stop(ctx.currentTime + 0.15);
  }, [createNoiseBuffer]);

  const initialize = useCallback(() => {
    if (audioContextRef.current) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;

    // Resume context if suspended (browser autoplay policy)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    // Main oscillator for the hum
    const oscillator = audioContext.createOscillator();
    oscillatorRef.current = oscillator;
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(80, audioContext.currentTime);

    // Second oscillator for richness
    const oscillator2 = audioContext.createOscillator();
    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(81.5, audioContext.currentTime); // Slight detune

    // LFO for subtle modulation
    const lfo = audioContext.createOscillator();
    lfoRef.current = lfo;
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.15, audioContext.currentTime);

    const lfoGain = audioContext.createGain();
    lfoGainRef.current = lfoGain;
    lfoGain.gain.setValueAtTime(3, audioContext.currentTime);

    // Filter for warmth
    const filter = audioContext.createBiquadFilter();
    filterRef.current = filter;
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, audioContext.currentTime);
    filter.Q.setValueAtTime(2, audioContext.currentTime);

    // Main gain
    const gainNode = audioContext.createGain();
    gainNodeRef.current = gainNode;
    gainNode.gain.setValueAtTime(0.06, audioContext.currentTime);

    // Noise layer for texture
    const noiseGain = audioContext.createGain();
    noiseGainRef.current = noiseGain;
    noiseGain.gain.setValueAtTime(0.008, audioContext.currentTime);

    const noiseBuffer = createNoiseBuffer(audioContext, 'pink');
    const noiseSource = audioContext.createBufferSource();
    noiseSourceRef.current = noiseSource;
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const noiseFilter = audioContext.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(400, audioContext.currentTime);

    // Connect nodes
    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);
    lfoGain.connect(oscillator2.frequency);
    oscillator.connect(filter);
    oscillator2.connect(filter);
    filter.connect(gainNode);
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator2.start();
    lfo.start();
    noiseSource.start();

    // Start idle sound interval
    idleSoundIntervalRef.current = window.setInterval(() => {
      if (Math.random() > 0.6) {
        playIdleSound();
      }
    }, 8000);

    setState(prev => ({ ...prev, isPlaying: true, frequency: 0.5 }));
  }, [createNoiseBuffer, playIdleSound]);

  const updateFrequency = useCallback((normalizedFreq: number) => {
    if (!audioContextRef.current || !oscillatorRef.current || !filterRef.current || !gainNodeRef.current) return;

    const ctx = audioContextRef.current;
    const osc = oscillatorRef.current;
    const filter = filterRef.current;
    const gain = gainNodeRef.current;
    const lfoGain = lfoGainRef.current;
    const noiseGain = noiseGainRef.current;

    const isOverloaded = normalizedFreq >= 0.95;
    
    // Map frequency to pitch (50-180 Hz for deep to medium hum)
    const pitch = 50 + normalizedFreq * 130;
    osc.frequency.linearRampToValueAtTime(pitch, ctx.currentTime + 0.1);

    // Map frequency to filter (150-1200 Hz)
    const filterFreq = 150 + normalizedFreq * 1050;
    filter.frequency.linearRampToValueAtTime(filterFreq, ctx.currentTime + 0.1);

    // Volume based on frequency
    const volume = isOverloaded ? 0.12 : 0.05 + normalizedFreq * 0.04;
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.1);

    // LFO intensity increases with frequency
    if (lfoGain) {
      const lfoIntensity = isOverloaded ? 25 : 3 + normalizedFreq * 12;
      lfoGain.gain.linearRampToValueAtTime(lfoIntensity, ctx.currentTime + 0.1);
    }

    // Noise increases with frequency
    if (noiseGain) {
      const noiseVol = isOverloaded ? 0.03 : 0.005 + normalizedFreq * 0.015;
      noiseGain.gain.linearRampToValueAtTime(noiseVol, ctx.currentTime + 0.1);
    }

    // Distortion at high frequencies
    if (isOverloaded && osc.type !== 'sawtooth') {
      osc.type = 'sawtooth';
    } else if (!isOverloaded && osc.type !== 'sine') {
      osc.type = 'sine';
    }

    setState(prev => ({ ...prev, frequency: normalizedFreq, isOverloaded }));
  }, []);

  const stop = useCallback(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.5);
    }
    if (idleSoundIntervalRef.current) {
      clearInterval(idleSoundIntervalRef.current);
    }
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const resume = useCallback(() => {
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(0.05, audioContextRef.current.currentTime + 0.5);
    }
    setState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (idleSoundIntervalRef.current) {
        clearInterval(idleSoundIntervalRef.current);
      }
      if (dustSoundTimeoutRef.current) {
        clearTimeout(dustSoundTimeoutRef.current);
      }
    };
  }, []);

  return {
    initialize,
    updateFrequency,
    stop,
    resume,
    playDustCleanSound,
    playIdleSound,
    playCrackRepairSound,
    playDustExplosionSound,
    ...state,
  };
};
