import React, { useState, useCallback } from 'react';
import { Sparkles, Zap, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/ImageUpload';
import { ImageComparison } from '@/components/ImageComparison';
import { ProcessingStatus } from '@/components/ProcessingStatus';
import { dehazingProcessor } from '@/lib/oddnet-dehazing';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageSelect = useCallback((file: File) => {
    setSelectedImage(file);
    setProcessedImageUrl(null);
    setError(null);
    setProgress(0);
    setStage('');
  }, []);

  const handleClearImage = useCallback(() => {
    setSelectedImage(null);
    setProcessedImageUrl(null);
    setError(null);
    setProgress(0);
    setStage('');
  }, []);

  const handleDehazeImage = useCallback(async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setError(null);
    setProgress(0);

    try {
      const processedBlob = await dehazingProcessor.dehaze(selectedImage, ({ stage, progress }) => {
        setStage(stage);
        setProgress(progress);
      });

      const processedUrl = URL.createObjectURL(processedBlob);
      setProcessedImageUrl(processedUrl);
      
      toast({
        title: "Image processed successfully!",
        description: "Your image has been dehazed using ODD-Net algorithm.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Processing failed",
        description: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  }, [selectedImage, toast]);

  const handleDownload = useCallback(() => {
    if (!processedImageUrl) return;
    
    const link = document.createElement('a');
    link.href = processedImageUrl;
    link.download = `dehazed_${selectedImage?.name || 'image'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [processedImageUrl, selectedImage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <Eye className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">ClearVision AI</h1>
                <p className="text-sm text-muted-foreground">ODD-Net Image Dehazing</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4" />
              <span>Powered by ODD-Net Algorithm</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Advanced AI Dehazing Technology
            </div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Transform Hazed Images to
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Crystal Clear</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Upload your foggy, hazy, or unclear images and watch as our ODD-Net algorithm 
              removes atmospheric haze to reveal stunning clarity and detail.
            </p>
          </div>

          {/* Upload Section */}
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">1. Upload Your Hazed Image</h3>
              <ImageUpload
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
                onClear={handleClearImage}
                isProcessing={isProcessing}
              />
              
              {selectedImage && !processedImageUrl && (
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleDehazeImage}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Zap className="h-5 w-5 animate-pulse" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Dehaze Image with ODD-Net
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">2. Processing Status</h3>
              <ProcessingStatus
                isProcessing={isProcessing}
                progress={progress}
                stage={stage}
                error={error}
              />
              
              {!isProcessing && !processedImageUrl && !error && (
                <div className="rounded-lg border-2 border-dashed border-muted bg-muted/30 p-8 text-center">
                  <div className="space-y-2">
                    <div className="mx-auto h-12 w-12 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                      <Eye className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Processing results will appear here
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          {processedImageUrl && selectedImage && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold">3. Compare Results</h3>
                <p className="text-muted-foreground">Drag the slider to see the difference</p>
              </div>
              
              <ImageComparison
                originalImage={URL.createObjectURL(selectedImage)}
                processedImage={processedImageUrl}
                onDownload={handleDownload}
              />
            </div>
          )}

          {/* Features */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold">ODD-Net Algorithm</h4>
              <p className="text-sm text-muted-foreground mt-2">
                State-of-the-art neural network designed specifically for image dehazing
              </p>
            </div>
            
            <div className="rounded-lg border bg-card p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Eye className="h-6 w-6 text-accent-foreground" />
              </div>
              <h4 className="font-semibold">Enhanced Clarity</h4>
              <p className="text-sm text-muted-foreground mt-2">
                Removes atmospheric haze while preserving image details and colors
              </p>
            </div>
            
            <div className="rounded-lg border bg-card p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <Download className="h-6 w-6 text-success" />
              </div>
              <h4 className="font-semibold">High Quality Output</h4>
              <p className="text-sm text-muted-foreground mt-2">
                Download your dehazed images in high resolution PNG format
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 ClearVision AI. Powered by ODD-Net dehazing algorithm.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
