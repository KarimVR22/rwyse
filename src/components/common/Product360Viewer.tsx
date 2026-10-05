import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RotateCcw, Play, Pause, Maximize2, Minimize2, MoveHorizontal } from 'lucide-react';

interface Product360ViewerProps {
  frames: string[];
  productName: string;
  className?: string;
}

export const Product360Viewer: React.FC<Product360ViewerProps> = ({
  frames = [],
  productName,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHelperPrompt, setShowHelperPrompt] = useState(true);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startFrameRef = useRef(0);

  // If no custom frames are supplied, create fallback sequence from images
  const frameList = frames.length > 0 ? frames : [
    '/placeholder-360-1.jpg',
  ];

  const totalFrames = frameList.length;

  // Auto-spin interval
  useEffect(() => {
    if (!isAutoSpinning || totalFrames <= 1) return;

    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % totalFrames);
    }, 90);

    return () => clearInterval(interval);
  }, [isAutoSpinning, totalFrames]);

  // Drag interaction
  const handleStart = (clientX: number) => {
    isDraggingRef.current = true;
    startXRef.current = clientX;
    startFrameRef.current = currentFrameIndex;
    setIsAutoSpinning(false);
    setShowHelperPrompt(false);
  };

  const handleMove = useCallback((clientX: number) => {
    if (!isDraggingRef.current || totalFrames <= 1) return;

    const deltaX = clientX - startXRef.current;
    // Each 14 pixels of horizontal travel shifts one 360 degree frame
    const sensitivity = 14;
    const frameDelta = Math.floor(deltaX / sensitivity);

    let newIndex = (startFrameRef.current - frameDelta) % totalFrames;
    if (newIndex < 0) {
      newIndex += totalFrames;
    }

    setCurrentFrameIndex(newIndex);
  }, [totalFrames]);

  const handleEnd = () => {
    isDraggingRef.current = false;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[450px] sm:h-[550px] bg-[#09090d] border border-neutral-800 overflow-hidden select-none group cursor-ew-resize ${className}`}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => {
        if (e.touches[0]) handleStart(e.touches[0].clientX);
      }}
      onTouchMove={(e) => {
        if (e.touches[0]) handleMove(e.touches[0].clientX);
      }}
      onTouchEnd={handleEnd}
    >
      {/* 360 Current Frame Image */}
      <div className="w-full h-full flex items-center justify-center p-4">
        <img
          src={frameList[currentFrameIndex] || frameList[0]}
          alt={`${productName} - 360° Angle ${currentFrameIndex + 1}`}
          className="w-full h-full object-contain pointer-events-none transition-transform duration-75"
          draggable={false}
        />
      </div>

      {/* Top Floating Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md border border-neutral-700/80 text-[10px] font-mono uppercase tracking-[0.2em] text-white flex items-center gap-1.5 shadow-xl">
          <RotateCcw className="w-3 h-3 text-cyan-400" />
          360° CINEMATIC ROTATION
        </span>
        <span className="px-2 py-1 bg-black/60 backdrop-blur-md border border-neutral-800 text-[10px] font-mono text-neutral-400">
          FRAME {currentFrameIndex + 1} / {totalFrames}
        </span>
      </div>

      {/* Helper Prompt Overlay */}
      {showHelperPrompt && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/25 backdrop-blur-[1px] transition-opacity duration-300">
          <div className="px-5 py-3 bg-[#111116]/95 border border-neutral-700 text-center shadow-2xl flex flex-col items-center gap-2 animate-bounce">
            <MoveHorizontal className="w-5 h-5 text-white" />
            <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-white font-bold">
              DRAG TO ROTATE
            </div>
            <div className="text-[10px] text-neutral-400 font-sans">
              Glissez horizontalement pour faire tourner le vêtement
            </div>
          </div>
        </div>
      )}

      {/* Bottom Frame Scrub Indicator */}
      <div className="absolute bottom-16 inset-x-8 z-10 pointer-events-none">
        <div className="w-full h-0.5 bg-neutral-800/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-75"
            style={{ width: `${((currentFrameIndex + 1) / totalFrames) * 100}%` }}
          />
        </div>
      </div>

      {/* Floating Control Toolbar */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-black/80 backdrop-blur-md p-1.5 border border-neutral-800 shadow-2xl">
        <button
          type="button"
          onClick={() => setIsAutoSpinning(!isAutoSpinning)}
          title={isAutoSpinning ? 'Pause rotation' : 'Auto 360° spin'}
          className={`p-2 transition-colors cursor-pointer ${
            isAutoSpinning ? 'text-white bg-neutral-800' : 'text-neutral-400 hover:text-white'
          }`}
        >
          {isAutoSpinning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={() => setCurrentFrameIndex(0)}
          title="Reset to front angle"
          className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          title="Fullscreen toggle"
          className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer border-l border-neutral-800 ml-0.5"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
