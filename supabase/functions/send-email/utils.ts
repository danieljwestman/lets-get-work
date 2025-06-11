
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
}

export const generateEmailId = (): string => {
  return `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const getClientInfo = (req: Request) => {
  const forwardedFor = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  const clientIP = forwardedFor.split(',')[0].trim()
  const userAgent = req.headers.get('user-agent')?.substring(0, 500) || 'unknown'
  
  return { clientIP, userAgent }
}

export const createErrorResponse = (message: string, status: number = 500) => {
  return new Response(
    JSON.stringify({ error: message }),
    { 
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  )
}

export const createSuccessResponse = (data: any) => {
  return new Response(
    JSON.stringify(data),
    { 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      } 
    }
  )
}
