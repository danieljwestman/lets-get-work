
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  isOpen, 
  onClose, 
  title = "Introduction Video" 
}) => {
  if (!videoUrl) return null;

  // Convert Tella.tv URLs to embed format
  const getEmbedUrl = (url: string) => {
    // Handle Tella.tv URLs
    if (url.includes('tella.tv/video/')) {
      return url.replace('/video/', '/embed/');
    }
    
    // Handle YouTube URLs
    if (url.includes('youtube.com/watch?v=') || url.includes('youtu.be/')) {
      const videoId = url.includes('youtu.be/') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    // Handle Vimeo URLs
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      if (videoId) {
        return `https://player.vimeo.com/video/${videoId}`;
      }
    }
    
    // Return original URL if no conversion needed
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            {title}
            <button
              onClick={onClose}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Video player for introduction video
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 px-6 pb-6">
          <div className="w-full h-full rounded-lg overflow-hidden bg-black">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={title}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
