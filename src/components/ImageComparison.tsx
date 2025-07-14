import React, { useState, useRef, useCallback } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageComparisonProps {
  originalImage: string;
  processedImage: string;
  onDownload: () => void;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({
  originalImage,
  processedImage,
  onDownload
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const newPosition = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, newPosition)));
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const newPosition = ((touch.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, newPosition)));
  }, []);

  return (
    <div className="space-y-6">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg border-2 border-border bg-card shadow-lg"
        style={{ aspectRatio: '16/9' }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Original (Hazed) Image */}
        <img
          src={originalImage}
          alt="Original hazed image"
          className="absolute inset-0 h-full w-full object-contain"
        />
        
        {/* Processed (Dehazed) Image */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={processedImage}
            alt="Dehazed image"
            className="h-full w-full object-contain"
          />
        </div>

        {/* Slider */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-primary shadow-lg cursor-ew-resize z-10"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          onTouchMove={handleTouchMove}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full shadow-lg flex items-center justify-center">
            <div className="w-3 h-3 bg-primary-foreground rounded-full"></div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
          Original (Hazed)
        </div>
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
          Dehazed
        </div>
      </div>

      {/* Download Button */}
      <div className="flex justify-center">
        <Button variant="success" onClick={onDownload} className="shadow-md hover:shadow-lg">
          <Download className="h-4 w-4" />
          Download Dehazed Image
        </Button>
      </div>
    </div>
  );
};