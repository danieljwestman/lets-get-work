
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

serve(async (req) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🔧 Getting domain configuration from environment variables...');
    
    // Get all required environment variables
    const MAIN_DOMAIN = Deno.env.get('MAIN_DOMAIN');
    const CONTACT_EMAIL = Deno.env.get('CONTACT_EMAIL');
    const COMPANY_WEBSITE = Deno.env.get('COMPANY_WEBSITE');
    const DEFAULT_SENDER_NAME = Deno.env.get('DEFAULT_SENDER_NAME');
    const ENV = Deno.env.get('ENV') || 'dev'; // Explicitly set to dev as default

    // Check for missing environment variables
    const missingVars = [];
    if (!MAIN_DOMAIN) missingVars.push('MAIN_DOMAIN');
    if (!CONTACT_EMAIL) missingVars.push('CONTACT_EMAIL');
    if (!COMPANY_WEBSITE) missingVars.push('COMPANY_WEBSITE');
    if (!DEFAULT_SENDER_NAME) missingVars.push('DEFAULT_SENDER_NAME');

    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:', missingVars);
      return new Response(
        JSON.stringify({ 
          error: 'Configuration Error', 
          message: `Missing required environment variables: ${missingVars.join(', ')}. Please configure these in Supabase Edge Functions settings.`,
          missingVariables: missingVars
        }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }

    const config = {
      mainDomain: MAIN_DOMAIN,
      contactEmail: CONTACT_EMAIL,
      companyWebsite: COMPANY_WEBSITE,
      defaultSenderName: DEFAULT_SENDER_NAME,
      environment: ENV
    };

    console.log('✅ Domain configuration loaded successfully:', {
      mainDomain: config.mainDomain,
      contactEmail: config.contactEmail,
      companyWebsite: config.companyWebsite,
      defaultSenderName: config.defaultSenderName,
      environment: config.environment
    });

    return new Response(
      JSON.stringify({ data: config }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        }
      }
    );

  } catch (error: any) {
    console.error('💥 Error in get-domain-config function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to load domain configuration',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
});
