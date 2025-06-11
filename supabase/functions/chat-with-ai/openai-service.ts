
interface OpenAIResponse {
  content: string;
}

export const callOpenAI = async (message: string, careerKnowledge: string): Promise<OpenAIResponse> => {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  console.log('Making API request to OpenAI...');
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: careerKnowledge },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 600
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('OpenAI API Error:', errorData);
    
    let errorMessage = 'Failed to get AI response';
    if (response.status === 401) {
      errorMessage = 'Invalid API key configuration';
    } else if (response.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again later.';
    } else if (response.status === 403) {
      errorMessage = 'Access denied. Please check API key permissions.';
    }
    
    throw new Error(errorMessage);
  }

  const data = await response.json();
  console.log('OpenAI Response received');

  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid response format from OpenAI API');
  }

  return { content: data.choices[0].message.content };
};
