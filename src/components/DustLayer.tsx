import React, { useRef, useEffect, useCallback } from 'react';
import { DustParticle } from '@/hooks/useEntropyState';

interface DustLayerProps {
  particles: DustParticle[];
  onClean: (x: number, y: number, radius: number) => void;
  dustLevel: number;
}

export const DustLayer: React.FC<DustLayerProps> = ({
  particles,
  onClean,
  dustLevel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isCleaningRef = useRef(false);

  const handleClean = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    
    onClean(x, y, 8);
  }, [onClean]);

  const handleMouseDown = useCallback(() => {
    isCleaningRef.current = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    isCleaningRef.current = false;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isCleaningRef.current) {
      handleClean(e.clientX, e.clientY);
    }
  }, [handleClean]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleClean(touch.clientX, touch.clientY);
  }, [handleClean]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      const x = (particle.x / 100) * window.innerWidth;
      const y = (particle.y / 100) * window.innerHeight;

      ctx.beginPath();
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(220, 10%, 50%, ${particle.opacity})`;
      ctx.fill();
    });
  }, [particles]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-30"
      style={{
        cursor: dustLevel > 0 ? 'crosshair' : 'default',
        backdropFilter: `blur(${dustLevel * 3}px)`,
        WebkitBackdropFilter: `blur(${dustLevel * 3}px)`,
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onTouchMove={handleTouchMove}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
      
      {/* Dust level indicator */}
      {dustLevel > 0.1 && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2 glass-panel px-3 py-2 rounded-full">
          <span className="font-mono text-xs text-muted-foreground">
            dust
          </span>
          <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-entropy-dust transition-all duration-300"
              style={{ width: `${dustLevel * 100}%` }}
            />
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {Math.round(dustLevel * 100)}%
          </span>
        </div>
      )}

      {/* Cleaning hint */}
      {dustLevel > 0.3 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-panel px-4 py-2 rounded-full">
          <span className="font-mono text-xs text-muted-foreground animate-pulse">
            drag to clean
          </span>
        </div>
      )}
    </div>
  );
};
