import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomQuote } from '@/data/thoughts';

interface HiddenQuoteProps {
  show: boolean;
  onDismiss: () => void;
}

export const HiddenQuote: React.FC<HiddenQuoteProps> = ({
  show,
  onDismiss,
}) => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    if (show) {
      setQuote(getRandomQuote());
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          onClick={onDismiss}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Quote card */}
          <motion.div
            className="relative glass-panel px-12 py-10 rounded-2xl max-w-2xl text-center"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Decorative elements */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2">
              <span className="font-mono text-xs tracking-[0.3em] text-primary/60">
                CLARITY ACHIEVED
              </span>
            </div>

            {/* Quote */}
            <motion.blockquote
              className="font-serif text-2xl md:text-3xl italic text-foreground leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              "{quote}"
            </motion.blockquote>

            {/* Dismiss hint */}
            <motion.p
              className="mt-8 font-mono text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5] }}
              transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
            >
              click anywhere to continue
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
