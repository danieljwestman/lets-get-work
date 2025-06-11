
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from './utils.ts';
import { handleEmailRequest } from './handlers/requestHandler.ts';

serve(async (req) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Handle email requests
  return await handleEmailRequest(req);
});
