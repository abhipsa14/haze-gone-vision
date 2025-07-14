import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcessingStatusProps {
  isProcessing: boolean;
  progress: number;
  stage: string;
  error?: string;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  isProcessing,
  progress,
  stage,
  error
}) => {
  if (error) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <h3 className="font-semibold text-destructive">Processing Error</h3>
        </div>
        <p className="mt-2 text-sm text-destructive/80">{error}</p>
      </div>
    );
  }

  if (!isProcessing && progress === 100) {
    return (
      <div className="rounded-lg border border-success/20 bg-success/5 p-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <h3 className="font-semibold text-success">Processing Complete!</h3>
        </div>
        <p className="mt-1 text-sm text-success/80">Your image has been successfully dehazed.</p>
      </div>
    );
  }

  if (!isProcessing) return null;

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">Processing Image</h3>
          <p className="text-sm text-muted-foreground">{stage}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
};