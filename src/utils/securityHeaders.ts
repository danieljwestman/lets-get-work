
// Security headers utility for client-side configuration
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

export const CSP_DIRECTIVES = {
  'default-src': "'self'",
  'script-src': "'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
  'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com",
  'img-src': "'self' data: https: blob:",
  'font-src': "'self' https://fonts.gstatic.com",
  'connect-src': "'self' https://*.supabase.co https://api.openai.com https://api.resend.com",
  'frame-src': "'none'",
  'object-src': "'none'",
  'base-uri': "'self'",
  'form-action': "'self'"
};

export const generateCSP = (): string => {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, value]) => `${directive} ${value}`)
    .join('; ');
};

// Function to apply security headers (useful for testing)
export const applySecurityHeaders = (response: Response): Response => {
  Object.entries(SECURITY_HEADERS).forEach(([header, value]) => {
    response.headers.set(header, value);
  });
  
  response.headers.set('Content-Security-Policy', generateCSP());
  
  return response;
};
