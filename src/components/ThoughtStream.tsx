import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomThought } from '@/data/thoughts';

interface ThoughtStreamProps {
  frequency: number;
  isOverloaded: boolean;
}

interface ThoughtItem {
  id: number;
  text: string;
  category: 'past' | 'present' | 'future';
}

export const ThoughtStream: React.FC<ThoughtStreamProps> = ({
  frequency,
  isOverloaded,
}) => {
  const [thoughts, setThoughts] = useState<ThoughtItem[]>([
    { id: 1, text: getRandomThought('past'), category: 'past' },
    { id: 2, text: getRandomThought('present'), category: 'present' },
    { id: 3, text: getRandomThought('future'), category: 'future' },
  ]);

  const cycleThought = useCallback((category: 'past' | 'present' | 'future') => {
    setThoughts(prev =>
      prev.map(t =>
        t.category === category
          ? { ...t, id: Date.now() + Math.random(), text: getRandomThought(category) }
          : t
      )
    );
  }, []);

  useEffect(() => {
    const baseInterval = 8000 - frequency * 5000;
    
    const pastInterval = setInterval(() => cycleThought('past'), baseInterval * 1.2);
    const presentInterval = setInterval(() => cycleThought('present'), baseInterval);
    const futureInterval = setInterval(() => cycleThought('future'), baseInterval * 0.9);

    return () => {
      clearInterval(pastInterval);
      clearInterval(presentInterval);
      clearInterval(futureInterval);
    };
  }, [frequency, cycleThought]);

  const getThoughtStyles = (category: 'past' | 'present' | 'future') => {
    const baseBlur = isOverloaded ? 4 : frequency * 2;
    
    switch (category) {
      case 'past':
        return {
          top: '15%',
          blur: baseBlur + 1,
          opacity: 0.5 + (1 - frequency) * 0.3,
          scale: 0.9,
          color: 'hsl(var(--pastel-blue))',
        };
      case 'present':
        return {
          top: '50%',
          blur: baseBlur * 0.5,
          opacity: 0.7 + (1 - frequency) * 0.2,
          scale: 1,
          color: 'hsl(var(--pastel-cream))',
        };
      case 'future':
        return {
          top: '80%',
          blur: baseBlur + 2,
          opacity: 0.4 + (1 - frequency) * 0.3,
          scale: 0.85,
          color: 'hsl(var(--pastel-peach))',
        };
    }
  };

  const speed = 20 - frequency * 15;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence mode="popLayout">
        {thoughts.map(thought => {
          const styles = getThoughtStyles(thought.category);
          
          return (
            <motion.div
              key={thought.id}
              className="absolute left-0 right-0 flex justify-center px-8"
              style={{ top: styles.top }}
              initial={{ opacity: 0, x: -100, scale: styles.scale * 0.8 }}
              animate={{
                opacity: isOverloaded ? [styles.opacity, 0.2, styles.opacity] : styles.opacity,
                x: 0,
                scale: styles.scale,
                filter: `blur(${styles.blur}px)`,
              }}
              exit={{ opacity: 0, x: 100, scale: styles.scale * 0.8 }}
              transition={{
                duration: 1.5,
                ease: "easeOut",
                opacity: isOverloaded 
                  ? { duration: 0.2, repeat: Infinity } 
                  : { duration: 1.5 },
              }}
            >
              <motion.p
                className="thought-text text-2xl md:text-3xl lg:text-4xl text-center max-w-3xl"
                style={{ color: styles.color }}
                animate={{
                  y: [0, -10, 0],
                  x: [0, 5, -5, 0],
                }}
                transition={{
                  duration: speed,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                "{thought.text}"
              </motion.p>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Category labels */}
      <div className="absolute left-4 top-[15%] -translate-y-1/2">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground/40">
          past
        </span>
      </div>
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground/60">
          now
        </span>
      </div>
      <div className="absolute left-4 top-[80%] -translate-y-1/2">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground/40">
          soon
        </span>
      </div>
    </div>
  );
};
