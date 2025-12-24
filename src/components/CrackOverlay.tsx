import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crack } from '@/hooks/useEntropyState';

interface CrackOverlayProps {
  cracks: Crack[];
  onRepair: (crackId: number) => void;
  isOverloaded: boolean;
}

const CrackSVG: React.FC<{ scale: number; rotation: number }> = ({ scale, rotation }) => (
  <svg
    width={100 * scale}
    height={100 * scale}
    viewBox="0 0 100 100"
    style={{ transform: `rotate(${rotation}deg)` }}
  >
    <defs>
      <filter id="crack-glow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#crack-glow)" stroke="hsl(350, 50%, 70%)" strokeWidth="2" fill="none">
      <path d="M50,0 L45,20 L55,35 L40,50 L60,65 L45,80 L50,100" />
      <path d="M45,20 L30,25" />
      <path d="M55,35 L70,40" />
      <path d="M40,50 L25,55" />
      <path d="M60,65 L75,70" />
      <path d="M50,50 L65,45" />
      <path d="M50,50 L35,60" />
    </g>
  </svg>
);

export const CrackOverlay: React.FC<CrackOverlayProps> = ({
  cracks,
  onRepair,
  isOverloaded,
}) => {
  if (!isOverloaded && cracks.length === 0) return null;

  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
      {/* Distortion overlay */}
      <AnimatePresence>
        {isOverloaded && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: 'radial-gradient(circle, transparent 30%, hsl(350, 50%, 20%, 0.3) 100%)',
              mixBlendMode: 'multiply',
            }}
          />
        )}
      </AnimatePresence>

      {/* Color inversion effect */}
      <AnimatePresence>
        {isOverloaded && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, repeat: Infinity }}
            style={{
              backdropFilter: 'invert(0.2) hue-rotate(180deg)',
              WebkitBackdropFilter: 'invert(0.2) hue-rotate(180deg)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Cracks */}
      <AnimatePresence>
        {cracks.map(crack => (
          <motion.div
            key={crack.id}
            className="absolute cursor-pointer pointer-events-auto"
            style={{
              left: `${crack.x}%`,
              top: `${crack.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              filter: ['drop-shadow(0 0 10px hsl(350, 50%, 60%))', 'drop-shadow(0 0 20px hsl(350, 50%, 60%))', 'drop-shadow(0 0 10px hsl(350, 50%, 60%))'],
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ 
              duration: 0.3,
              filter: { duration: 1, repeat: Infinity },
            }}
            onClick={() => onRepair(crack.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <CrackSVG scale={crack.scale} rotation={crack.rotation} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Repair hint */}
      <AnimatePresence>
        {cracks.length > 0 && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass-panel px-6 py-3 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <p className="font-mono text-sm text-entropy-crack animate-pulse">
              OVERLOAD — Click cracks to repair ({cracks.length} remaining)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
