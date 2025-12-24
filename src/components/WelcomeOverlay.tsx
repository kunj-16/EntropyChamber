import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeOverlayProps {
  show: boolean;
  onStart: () => void;
}

export const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({
  show,
  onStart,
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
          <motion.div
            className="text-center px-8 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
          >
            {/* Title */}
            <motion.h1
              className="font-serif text-4xl md:text-6xl text-foreground mb-6 tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              The Entropy Chamber
            </motion.h1>

            {/* Tagline */}
            <motion.p
              className="font-serif text-lg md:text-xl text-muted-foreground italic mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              A useless sensory ecosystem that decays without your attention.
            </motion.p>

            {/* Instructions */}
            <motion.div
              className="space-y-4 mb-12 text-sm text-muted-foreground font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <p>↻ Rotate the dial to shift the atmosphere</p>
              <p>✋ Clean the dust with your cursor</p>
              <p>⚡ Repair the cracks when chaos erupts</p>
              <p>🌿 Patience unlocks hidden rewards</p>
            </motion.div>

            {/* Start button */}
            <motion.button
              className="glass-panel px-8 py-4 rounded-full font-mono text-sm tracking-widest text-foreground hover:bg-primary/10 transition-colors duration-300"
              onClick={onStart}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ENTER THE CHAMBER
            </motion.button>

            {/* Audio notice */}
            <motion.p
              className="mt-6 text-xs text-muted-foreground/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              (sound will be enabled)
            </motion.p>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ delay: 2, duration: 3, repeat: Infinity }}
          >
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-muted-foreground/30 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
