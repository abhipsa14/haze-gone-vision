import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
  isProcessing: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  selectedImage,
  onClear,
  isProcessing
}) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: FileList | null) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type.startsWith('image/')) {
        onImageSelect(file);
      }
    }
    setIsDragActive(false);
  }, [onImageSelect]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const onDropHandler = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    onDrop(e.dataTransfer.files);
  }, [onDrop]);

  const onFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onDrop(e.target.files);
  }, [onDrop]);

  if (selectedImage) {
    return (
      <div className="relative">
        <div className="relative rounded-lg border-2 border-border bg-card p-4">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected image"
            className="max-h-64 w-full rounded-lg object-contain"
          />
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{selectedImage.name}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClear}
              disabled={isProcessing}
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative rounded-lg border-2 border-dashed p-8 transition-all duration-300",
        isDragActive 
          ? "border-primary bg-primary/5 shadow-glow" 
          : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDropHandler}
    >
      <input
        type="file"
        accept="image/*"
        onChange={onFileInputChange}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        disabled={isProcessing}
      />
      
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className={cn(
          "rounded-full p-4 transition-all duration-300",
          isDragActive ? "bg-primary/10" : "bg-accent/50"
        )}>
          <Upload className={cn(
            "h-8 w-8 transition-colors duration-300",
            isDragActive ? "text-primary" : "text-muted-foreground"
          )} />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Upload Hazed Image</h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop your hazed image here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supports JPG, PNG, WEBP (Max 10MB)
          </p>
        </div>
        
        <Button variant="outline" size="sm" disabled={isProcessing}>
          <Upload className="h-4 w-4" />
          Choose File
        </Button>
      </div>
    </div>
  );
};