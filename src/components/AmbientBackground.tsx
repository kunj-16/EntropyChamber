import React from 'react';
import { motion } from 'framer-motion';

interface AmbientBackgroundProps {
  frequency: number;
  isOverloaded: boolean;
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({
  frequency,
  isOverloaded,
}) => {
  // Color interpolation based on frequency
  // Low: teal/blue | Mid: lavender/sage | High: peach/coral
  const getGradientColors = () => {
    if (isOverloaded) {
      return {
        primary: 'hsl(350, 40%, 25%)',
        secondary: 'hsl(20, 30%, 20%)',
        accent: 'hsl(350, 50%, 30%)',
      };
    }

    if (frequency < 0.33) {
      // Cool tones
      const t = frequency / 0.33;
      return {
        primary: `hsl(${175 + t * 20}, 35%, ${12 + t * 3}%)`,
        secondary: `hsl(${210 - t * 20}, 30%, ${8 + t * 2}%)`,
        accent: `hsl(${175 + t * 30}, 40%, ${20 + t * 5}%)`,
      };
    } else if (frequency < 0.66) {
      // Neutral/lavender tones
      const t = (frequency - 0.33) / 0.33;
      return {
        primary: `hsl(${195 + t * 75}, 30%, ${15 + t * 2}%)`,
        secondary: `hsl(${190 + t * 50}, 25%, ${10 + t * 3}%)`,
        accent: `hsl(${200 + t * 70}, 35%, ${25 + t * 5}%)`,
      };
    } else {
      // Warm tones
      const t = (frequency - 0.66) / 0.34;
      return {
        primary: `hsl(${270 - t * 245}, 25%, ${17 + t * 3}%)`,
        secondary: `hsl(${240 - t * 220}, 20%, ${13 + t * 2}%)`,
        accent: `hsl(${270 - t * 245}, 35%, ${30 + t * 5}%)`,
      };
    }
  };

  const colors = getGradientColors();

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.primary} 100%)`,
        }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />

      {/* Radial accent */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: `radial-gradient(ellipse at 50% 50%, ${colors.accent}40 0%, transparent 60%)`,
        }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />

      {/* Floating orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${colors.accent}30 0%, transparent 70%)`,
        }}
        animate={{
          x: ['-10%', '10%', '-10%'],
          y: ['-10%', '5%', '-10%'],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute right-0 bottom-0 w-80 h-80 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${colors.accent}20 0%, transparent 70%)`,
        }}
        animate={{
          x: ['10%', '-10%', '10%'],
          y: ['10%', '-5%', '10%'],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, hsla(220, 30%, 5%, 0.4) 100%)',
        }}
      />
    </div>
  );
};
