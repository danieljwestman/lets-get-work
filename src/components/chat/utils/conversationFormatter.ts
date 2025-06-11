
export const formatConversationContext = (conversationContext: string): string => {
  if (!conversationContext) return '';
  
  try {
    // Try to parse if it's JSON format
    const messages = JSON.parse(conversationContext);
    if (Array.isArray(messages)) {
      return messages.map((msg: any, index: number) => {
        const sender = msg.sender === 'user' ? 'User' : 'DaniBot';
        const content = msg.content || '';
        return `${index + 1}. ${sender}: ${content}`;
      }).join('\n\n');
    }
  } catch (e) {
    // If not JSON, treat as plain text and try to format it
    // Split by common patterns that might indicate message boundaries
    const lines = conversationContext.split(/(?:User:|DaniBot:|Assistant:)/);
    if (lines.length > 1) {
      return lines
        .filter(line => line.trim())
        .map((line, index) => {
          const isEven = index % 2 === 0;
          const sender = isEven ? 'User' : 'DaniBot';
          return `${Math.floor(index / 2) + 1}. ${sender}: ${line.trim()}`;
        })
        .join('\n\n');
    }
  }
  
  // Fallback: just return the original with some basic formatting
  return conversationContext.replace(/\s+/g, ' ').trim();
};
