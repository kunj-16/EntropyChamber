import { useState, useCallback, useEffect, useRef } from 'react';

export interface DustParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export interface Crack {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export interface MossCluster {
  id: number;
  corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  growth: number;
}

export interface EntropyState {
  frequency: number;
  dustLevel: number;
  dustParticles: DustParticle[];
  isOverloaded: boolean;
  cracks: Crack[];
  moss: MossCluster[];
  patienceTimer: number;
  showHiddenQuote: boolean;
  isAudioInitialized: boolean;
  dustExplosionTriggered: boolean;
}

const DUST_SPAWN_INTERVAL = 200;
const PATIENCE_THRESHOLD = 300; // 5 minutes in seconds
const MAX_DUST_PARTICLES = 500;

export const useEntropyState = () => {
  const [state, setState] = useState<EntropyState>({
    frequency: 0.5,
    dustLevel: 0,
    dustParticles: [],
    isOverloaded: false,
    cracks: [],
    moss: [],
    patienceTimer: 0,
    showHiddenQuote: false,
    isAudioInitialized: false,
    dustExplosionTriggered: false,
  });

  const lastActivityRef = useRef<number>(Date.now());
  const patienceStartRef = useRef<number | null>(null);

  const setFrequency = useCallback((freq: number) => {
    lastActivityRef.current = Date.now();
    
    setState(prev => {
      const isOverloaded = freq >= 0.95;
      const newCracks = isOverloaded && !prev.isOverloaded
        ? generateCracks()
        : prev.cracks;

      // Reset patience timer if overloaded or frequency too extreme
      const isSteadyMidRange = freq >= 0.3 && freq <= 0.7;
      if (!isSteadyMidRange || isOverloaded) {
        patienceStartRef.current = null;
      }

      return {
        ...prev,
        frequency: freq,
        isOverloaded,
        cracks: newCracks,
      };
    });
  }, []);

  const generateCracks = (): Crack[] => {
    const numCracks = 3 + Math.floor(Math.random() * 4);
    return Array.from({ length: numCracks }, (_, i) => ({
      id: Date.now() + i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5,
    }));
  };

  const repairCrack = useCallback((crackId: number) => {
    lastActivityRef.current = Date.now();
    
    setState(prev => {
      const newCracks = prev.cracks.filter(c => c.id !== crackId);
      return {
        ...prev,
        cracks: newCracks,
        isOverloaded: newCracks.length > 0,
        frequency: newCracks.length === 0 ? 0.5 : prev.frequency,
      };
    });
  }, []);

  const cleanDust = useCallback((x: number, y: number, radius: number = 50) => {
    lastActivityRef.current = Date.now();
    
    setState(prev => {
      const newParticles = prev.dustParticles.filter(particle => {
        const dx = particle.x - x;
        const dy = particle.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance > radius;
      });

      const newDustLevel = Math.max(0, newParticles.length / MAX_DUST_PARTICLES);
      const showHiddenQuote = newDustLevel === 0 && prev.dustLevel > 0;

      return {
        ...prev,
        dustParticles: newParticles,
        dustLevel: newDustLevel,
        showHiddenQuote,
      };
    });
  }, []);

  const initializeAudio = useCallback(() => {
    setState(prev => ({ ...prev, isAudioInitialized: true }));
  }, []);

  const dismissQuote = useCallback(() => {
    setState(prev => ({ ...prev, showHiddenQuote: false }));
  }, []);

  // Reset explosion trigger when dust is cleaned
  const resetDustExplosion = useCallback(() => {
    setState(prev => ({ ...prev, dustExplosionTriggered: false }));
  }, []);

  // Dust accumulation effect
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivityRef.current;
      
      // Only spawn dust if inactive for more than 2 seconds
      if (timeSinceActivity > 2000) {
        setState(prev => {
          if (prev.dustParticles.length >= MAX_DUST_PARTICLES || prev.isOverloaded) {
            // Check if dust just reached max and explosion hasn't been triggered
            if (prev.dustParticles.length >= MAX_DUST_PARTICLES && !prev.dustExplosionTriggered) {
              return {
                ...prev,
                dustExplosionTriggered: true,
              };
            }
            return prev;
          }

          const spawnRate = Math.min(3, Math.floor(timeSinceActivity / 3000) + 1);
          const newParticles: DustParticle[] = [];

          for (let i = 0; i < spawnRate; i++) {
            newParticles.push({
              id: Date.now() + Math.random(),
              x: Math.random() * 100,
              y: Math.random() * 100,
              size: 2 + Math.random() * 4,
              opacity: 0.3 + Math.random() * 0.4,
            });
          }

          const allParticles = [...prev.dustParticles, ...newParticles].slice(0, MAX_DUST_PARTICLES);
          const newDustLevel = allParticles.length / MAX_DUST_PARTICLES;
          
          // Trigger explosion when hitting 100%
          const shouldExplode = newDustLevel >= 1 && !prev.dustExplosionTriggered;
          
          return {
            ...prev,
            dustParticles: allParticles,
            dustLevel: newDustLevel,
            dustExplosionTriggered: shouldExplode ? true : prev.dustExplosionTriggered,
          };
        });
      }
    }, DUST_SPAWN_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Patience timer and moss growth
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const isSteadyMidRange = prev.frequency >= 0.3 && prev.frequency <= 0.7;
        const isClean = prev.dustLevel < 0.1;
        const isPatient = isSteadyMidRange && isClean && !prev.isOverloaded;

        if (!isPatient) {
          patienceStartRef.current = null;
          return prev;
        }

        if (patienceStartRef.current === null) {
          patienceStartRef.current = Date.now();
        }

        const patienceTimer = Math.floor((Date.now() - patienceStartRef.current) / 1000);
        
        // Generate moss at patience threshold
        let newMoss = prev.moss;
        if (patienceTimer >= PATIENCE_THRESHOLD && prev.moss.length === 0) {
          const corners: ('top-left' | 'top-right' | 'bottom-left' | 'bottom-right')[] = 
            ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
          
          newMoss = corners.map((corner, i) => ({
            id: Date.now() + i,
            corner,
            growth: 0,
          }));
        }

        // Grow existing moss
        if (newMoss.length > 0) {
          newMoss = newMoss.map(m => ({
            ...m,
            growth: Math.min(1, m.growth + 0.01),
          }));
        }

        return {
          ...prev,
          patienceTimer,
          moss: newMoss,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    ...state,
    setFrequency,
    cleanDust,
    repairCrack,
    initializeAudio,
    dismissQuote,
    resetDustExplosion,
  };
};
