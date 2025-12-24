import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MossCluster } from '@/hooks/useEntropyState';

interface MossGrowthProps {
  moss: MossCluster[];
  patienceTimer: number;
}

const PATIENCE_THRESHOLD = 300;

const MossClusterSVG: React.FC<{ growth: number }> = ({ growth }) => {
  const numCircles = Math.floor(growth * 15) + 3;
  
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <defs>
        <filter id="moss-blur">
          <feGaussianBlur stdDeviation="1" />
        </filter>
        <radialGradient id="moss-gradient">
          <stop offset="0%" stopColor="hsl(140, 50%, 50%)" />
          <stop offset="100%" stopColor="hsl(140, 40%, 35%)" />
        </radialGradient>
      </defs>
      {Array.from({ length: numCircles }).map((_, i) => {
        const angle = (i / numCircles) * Math.PI * 2;
        const distance = 20 + (i % 3) * 15;
        const x = 60 + Math.cos(angle) * distance * growth;
        const y = 60 + Math.sin(angle) * distance * growth;
        const size = 5 + Math.random() * 10 * growth;
        
        return (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={size}
            fill="url(#moss-gradient)"
            filter="url(#moss-blur)"
            initial={{ opacity: 0, r: 0 }}
            animate={{ opacity: 0.7 + growth * 0.3, r: size }}
            transition={{ duration: 1, delay: i * 0.1 }}
          />
        );
      })}
    </svg>
  );
};

export const MossGrowth: React.FC<MossGrowthProps> = ({
  moss,
  patienceTimer,
}) => {
  const getCornerPosition = (corner: MossCluster['corner']) => {
    switch (corner) {
      case 'top-left':
        return { top: 0, left: 0 };
      case 'top-right':
        return { top: 0, right: 0 };
      case 'bottom-left':
        return { bottom: 0, left: 0 };
      case 'bottom-right':
        return { bottom: 0, right: 0 };
    }
  };

  const timeRemaining = Math.max(0, PATIENCE_THRESHOLD - patienceTimer);
  const progress = Math.min(1, patienceTimer / PATIENCE_THRESHOLD);

  return (
    <>
      {/* Patience timer (shown before moss appears) */}
      {moss.length === 0 && patienceTimer > 30 && (
        <motion.div
          className="absolute bottom-4 left-4 glass-panel px-4 py-2 rounded-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-entropy-moss">
              patience
            </span>
            <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-entropy-moss"
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
            </span>
          </div>
        </motion.div>
      )}

      {/* Moss clusters */}
      <AnimatePresence>
        {moss.map(cluster => (
          <motion.div
            key={cluster.id}
            className="absolute z-10 pointer-events-none"
            style={getCornerPosition(cluster.corner)}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <MossClusterSVG growth={cluster.growth} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Moss achievement notification */}
      <AnimatePresence>
        {moss.length > 0 && moss[0].growth < 0.3 && (
          <motion.div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 glass-panel px-6 py-4 rounded-lg text-center"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-serif text-lg text-entropy-moss mb-1">
              ✦ Digital Moss Unlocked ✦
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              Your patience has been rewarded
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
