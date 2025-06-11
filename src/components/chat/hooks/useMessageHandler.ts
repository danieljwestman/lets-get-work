
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { sendMessageToOpenAI } from '@/utils/openai';
import type { Message } from '@/types/chat';

interface UseMessageHandlerProps {
  addMessage: (message: Message) => void;
  clearInput: () => void;
  setIsLoading: (loading: boolean) => void;
}

export const useMessageHandler = ({ addMessage, clearInput, setIsLoading }: UseMessageHandlerProps) => {
  const { toast } = useToast();
  const { trackChatInteraction, trackChatPrompt } = useAnalytics();

  const handleSendMessage = async (inputValue: string) => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    addMessage(userMessage);
    clearInput();
    setIsLoading(true);

    // Track the chat prompt
    trackChatPrompt(inputValue.length, inputValue);

    // Track chat interaction
    trackChatInteraction('message_sent', {
      message_length: inputValue.length,
      message_preview: inputValue.substring(0, 50)
    });

    try {
      console.log('Sending message to AI:', inputValue);

      // Call the AI service
      const aiResponse = await sendMessageToOpenAI(inputValue);
      
      console.log('AI Response:', aiResponse);

      // Check if the response should trigger the email composer
      if (aiResponse.action === 'email_composed') {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse.content,
          sender: 'assistant',
          timestamp: new Date(),
          action: 'email_composed'
        };
        
        addMessage(assistantMessage);
        trackChatInteraction('email_composition_triggered');
      } else {
        // Regular chat response
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse.content,
          sender: 'assistant',
          timestamp: new Date()
        };

        addMessage(assistantMessage);
        trackChatInteraction('regular_chat_response');
      }
    } catch (error) {
      console.error('Error calling AI service:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      trackChatInteraction('error_occurred', {
        error_type: errorMessage
      });
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });

      // Add error message to chat
      const errorChatMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: `Sorry, I encountered an error: ${errorMessage}. Please try again in a moment.`,
        sender: 'assistant',
        timestamp: new Date()
      };
      addMessage(errorChatMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSent = () => {
    trackChatInteraction('email_sent_via_chat');
    
    // Show success toast with proper variant
    toast({
      title: "Email Sent Successfully! ✨",
      description: "Daniel will get back to you soon. Check your email for a confirmation.",
      variant: "success"
    });

    const emailSentMessage: Message = {
      id: (Date.now() + 3).toString(),
      content: "Perfect! Your email has been sent to Daniel. He'll get back to you soon!",
      sender: 'assistant',
      timestamp: new Date(),
      action: 'email_sent'
    };
    addMessage(emailSentMessage);
  };

  return {
    handleSendMessage,
    handleEmailSent
  };
};
