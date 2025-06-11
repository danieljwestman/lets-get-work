
export const emailKeywords = [
  'contact', 'email', 'send message', 'reach out', 'get in touch', 
  'compose', 'write to', 'message daniel', 'send to daniel',
  'contact daniel', 'reach daniel', 'write daniel'
];

export const isEmailRequest = (message: string): boolean => {
  return emailKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  );
};

export const createEmailResponse = () => {
  return {
    content: "Perfect! I'll open the email composer for you right now so you can send Daniel a direct message.",
    action: 'email_composed'
  };
};
