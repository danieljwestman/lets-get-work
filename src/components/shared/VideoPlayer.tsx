
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 border-0 bg-black rounded-lg overflow-hidden">
        {/* Minimal header with close button */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={onClose}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        
        {/* Video container taking full space */}
        <div className="w-full h-full">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
