import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

interface FrequencyDialProps {
  value: number;
  onChange: (value: number) => void;
  isOverloaded: boolean;
  onInteractionStart?: () => void;
}

export const FrequencyDial: React.FC<FrequencyDialProps> = ({
  value,
  onChange,
  isOverloaded,
  onInteractionStart,
}) => {
  const dialRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(value * 270 - 135);

  const handleInteraction = useCallback((clientX: number, clientY: number) => {
    if (!dialRef.current) return;

    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const angle = Math.atan2(clientY - centerY, clientX - centerX);
    let degrees = (angle * 180) / Math.PI + 90;

    // Normalize to -135 to 135 range
    if (degrees < -135) degrees += 360;
    if (degrees > 180) degrees -= 360;

    const clampedDegrees = Math.max(-135, Math.min(135, degrees));
    const normalizedValue = (clampedDegrees + 135) / 270;

    setRotation(clampedDegrees);
    onChange(normalizedValue);
  }, [onChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    onInteractionStart?.();
    handleInteraction(e.clientX, e.clientY);
  }, [handleInteraction, onInteractionStart]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleInteraction(e.clientX, e.clientY);
  }, [isDragging, handleInteraction]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    onInteractionStart?.();
    const touch = e.touches[0];
    handleInteraction(touch.clientX, touch.clientY);
  }, [handleInteraction, onInteractionStart]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    handleInteraction(touch.clientX, touch.clientY);
  }, [isDragging, handleInteraction]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  // Sync rotation with external value changes
  useEffect(() => {
    if (!isDragging) {
      setRotation(value * 270 - 135);
    }
  }, [value, isDragging]);

  const glowColor = isOverloaded 
    ? 'hsl(350, 50%, 60%)' 
    : `hsl(${175 - value * 160}, ${45 + value * 15}%, ${65 - value * 10}%)`;

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 320,
          height: 320,
          background: `radial-gradient(circle, ${glowColor}20 0%, transparent 70%)`,
        }}
        animate={{
          scale: isOverloaded ? [1, 1.1, 1] : [1, 1.02, 1],
          opacity: isOverloaded ? [0.8, 1, 0.8] : [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: isOverloaded ? 0.3 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main dial container */}
      <div
        ref={dialRef}
        className="relative cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ width: 240, height: 240 }}
      >
        {/* Dial background */}
        <motion.div
          className="absolute inset-0 rounded-full glass-panel"
          style={{
            boxShadow: `
              0 0 60px ${glowColor}40,
              0 0 120px ${glowColor}20,
              inset 0 0 40px ${glowColor}10
            `,
          }}
          animate={{
            boxShadow: isOverloaded
              ? [
                  `0 0 60px ${glowColor}60, 0 0 120px ${glowColor}40, inset 0 0 40px ${glowColor}20`,
                  `0 0 80px ${glowColor}80, 0 0 160px ${glowColor}50, inset 0 0 60px ${glowColor}30`,
                  `0 0 60px ${glowColor}60, 0 0 120px ${glowColor}40, inset 0 0 40px ${glowColor}20`,
                ]
              : undefined,
          }}
          transition={{ duration: 0.2, repeat: isOverloaded ? Infinity : 0 }}
        />

        {/* Inner dial face */}
        <div
          className="absolute rounded-full"
          style={{
            inset: 20,
            background: `
              radial-gradient(circle at 30% 30%, 
                hsl(var(--muted) / 0.8) 0%, 
                hsl(var(--background)) 100%
              )
            `,
            border: `1px solid ${glowColor}30`,
          }}
        />

        {/* Rotating indicator */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-75"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Notch indicator */}
          <div
            className="absolute w-1 rounded-full"
            style={{
              height: 30,
              top: 30,
              background: `linear-gradient(to bottom, ${glowColor}, transparent)`,
              boxShadow: `0 0 10px ${glowColor}`,
            }}
          />
        </div>

        {/* Center dot */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full"
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, hsl(var(--dial-inner)) 100%)`,
            boxShadow: `0 0 20px ${glowColor}60`,
          }}
        />

        {/* Tick marks */}
        {Array.from({ length: 11 }).map((_, i) => {
          const tickRotation = -135 + i * 27;
          const isActive = (i / 10) <= value;
          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 origin-center"
              style={{
                transform: `translate(-50%, -50%) rotate(${tickRotation}deg)`,
              }}
            >
              <div
                className="absolute -translate-x-1/2 transition-colors duration-300"
                style={{
                  width: 2,
                  height: i % 2 === 0 ? 12 : 8,
                  top: -108,
                  background: isActive ? glowColor : 'hsl(var(--muted-foreground) / 0.3)',
                  borderRadius: 1,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Frequency label */}
      <motion.div
        className="absolute -bottom-12 font-mono text-sm tracking-widest"
        style={{ color: glowColor }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {Math.round(value * 100)}Hz
      </motion.div>
    </div>
  );
};
