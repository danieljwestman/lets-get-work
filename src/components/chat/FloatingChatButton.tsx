
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/useAnalytics';

interface FloatingChatButtonProps {
  onClick: () => void;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick }) => {
  const { trackChatStart } = useAnalytics();

  const handleClick = () => {
    console.log('Floating button clicked');
    trackChatStart('floating_button');
    onClick();
  };

  return (
    <Button
      onClick={handleClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 z-50"
      size="icon"
    >
      <MessageCircle className="h-6 w-6 text-white" />
    </Button>
  );
};
