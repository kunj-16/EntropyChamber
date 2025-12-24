import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AmbientBackground } from './AmbientBackground';
import { FrequencyDial } from './FrequencyDial';
import { ThoughtStream } from './ThoughtStream';
import { DustLayer } from './DustLayer';
import { CrackOverlay } from './CrackOverlay';
import { MossGrowth } from './MossGrowth';
import { HiddenQuote } from './HiddenQuote';
import { WelcomeOverlay } from './WelcomeOverlay';
import { useEntropyState } from '@/hooks/useEntropyState';
import { useAudioEngine } from '@/hooks/useAudioEngine';

export const EntropyChamber: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showExplosion, setShowExplosion] = useState(false);
  
  const {
    frequency,
    dustLevel,
    dustParticles,
    isOverloaded,
    cracks,
    moss,
    patienceTimer,
    showHiddenQuote,
    isAudioInitialized,
    dustExplosionTriggered,
    setFrequency,
    cleanDust,
    repairCrack,
    initializeAudio,
    dismissQuote,
    resetDustExplosion,
  } = useEntropyState();

  const audioEngine = useAudioEngine();

  // Handle dust explosion
  useEffect(() => {
    if (dustExplosionTriggered && !showExplosion) {
      audioEngine.playDustExplosionSound();
      setShowExplosion(true);
      
      // Hide explosion after animation
      const timer = setTimeout(() => {
        setShowExplosion(false);
        resetDustExplosion();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [dustExplosionTriggered, showExplosion, audioEngine, resetDustExplosion]);

  const handleStart = useCallback(() => {
    audioEngine.initialize();
    initializeAudio();
    setShowWelcome(false);
  }, [audioEngine, initializeAudio]);

  const handleFrequencyChange = useCallback((value: number) => {
    setFrequency(value);
    audioEngine.updateFrequency(value);
  }, [setFrequency, audioEngine]);

  const handleDialInteractionStart = useCallback(() => {
    if (!audioEngine.isPlaying && isAudioInitialized) {
      audioEngine.resume();
    }
  }, [audioEngine, isAudioInitialized]);

  const handleDustClean = useCallback((x: number, y: number, radius: number) => {
    cleanDust(x, y, radius);
    // Play dust cleaning sound with throttling
    audioEngine.playDustCleanSound();
  }, [cleanDust, audioEngine]);

  const handleCrackRepair = useCallback((id: number) => {
    repairCrack(id);
    audioEngine.playCrackRepairSound();
  }, [repairCrack, audioEngine]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background layer */}
      <AmbientBackground 
        frequency={frequency} 
        isOverloaded={isOverloaded} 
      />

      {/* Thought stream (behind dial) */}
      <ThoughtStream 
        frequency={frequency} 
        isOverloaded={isOverloaded} 
      />

      {/* Central dial */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <FrequencyDial
          value={frequency}
          onChange={handleFrequencyChange}
          isOverloaded={isOverloaded}
          onInteractionStart={handleDialInteractionStart}
        />
      </div>

      {/* Moss growth (reward) */}
      <MossGrowth 
        moss={moss} 
        patienceTimer={patienceTimer} 
      />

      {/* Dust layer (interactive) */}
      <DustLayer
        particles={dustParticles}
        onClean={handleDustClean}
        dustLevel={dustLevel}
      />

      {/* Crack overlay (chaos state) */}
      <CrackOverlay
        cracks={cracks}
        onRepair={handleCrackRepair}
        isOverloaded={isOverloaded}
      />

      {/* Dust Explosion Effect */}
      <AnimatePresence>
        {showExplosion && (
          <>
            {/* Flash */}
            <motion.div
              className="absolute inset-0 z-50 pointer-events-none"
              initial={{ backgroundColor: 'rgba(255, 200, 100, 0)' }}
              animate={{ backgroundColor: ['rgba(255, 200, 100, 0.8)', 'rgba(255, 100, 50, 0.6)', 'rgba(255, 255, 255, 0)']} }
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
            
            {/* Shockwave ring */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none rounded-full border-4 border-orange-400/80"
              initial={{ width: 0, height: 0, opacity: 1 }}
              animate={{ width: '200vmax', height: '200vmax', opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            
            {/* Particle burst */}
            {Array.from({ length: 20 }).map((_, i) => {
              const angle = (i / 20) * Math.PI * 2;
              const distance = 300 + Math.random() * 200;
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;
              
              return (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 z-50 pointer-events-none rounded-full"
                  style={{
                    width: 8 + Math.random() * 16,
                    height: 8 + Math.random() * 16,
                    backgroundColor: `hsl(${30 + Math.random() * 30}, 90%, ${50 + Math.random() * 30}%)`,
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x, y, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.6 + Math.random() * 0.4, ease: 'easeOut' }}
                />
              );
            })}
            
            {/* BOOM text */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none font-mono text-6xl font-bold text-orange-500"
              style={{ textShadow: '0 0 30px rgba(255, 150, 50, 0.8), 0 0 60px rgba(255, 100, 0, 0.5)' }}
              initial={{ scale: 0, opacity: 0, rotate: -10 }}
              animate={{ scale: [0, 1.5, 1.2], opacity: [0, 1, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              BOOM!
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hidden quote modal */}
      <HiddenQuote
        show={showHiddenQuote}
        onDismiss={dismissQuote}
      />

      {/* Welcome overlay */}
      <WelcomeOverlay
        show={showWelcome}
        onStart={handleStart}
      />

      {/* Attribution */}
      {!showWelcome && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] text-muted-foreground/30 tracking-widest">
          THE ENTROPY CHAMBER
        </div>
      )}
    </div>
  );
};
