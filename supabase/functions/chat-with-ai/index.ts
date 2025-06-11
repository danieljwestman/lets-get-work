
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { careerKnowledge } from './knowledge-base.ts'
import { isEmailRequest, createEmailResponse } from './email-detector.ts'
import { callOpenAI } from './openai-service.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
}

// Rate limiting storage
const chatRateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Input sanitization for chat messages
const sanitizeChatInput = (input: string): string => {
  if (!input) return ''
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .slice(0, 2000) // Limit message length
}

// Rate limiting for chat
const isChatRateLimited = (identifier: string, maxRequests = 10, windowMs = 5 * 60 * 1000): boolean => {
  const now = Date.now()
  const entry = chatRateLimitStore.get(identifier)

  if (!entry || now > entry.resetTime) {
    chatRateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs })
    return false
  }

  if (entry.count >= maxRequests) {
    return true
  }

  entry.count++
  return false
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { message, action, emailData } = body

    // Get client info for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
                    req.headers.get('x-real-ip') || 
                    'unknown'
    const userAgent = req.headers.get('user-agent')?.substring(0, 100) || 'unknown'

    // Security logging
    console.log('Chat request received:', {
      hasMessage: !!message,
      messageLength: message?.length || 0,
      action: action || 'none',
      clientIP: clientIP.substring(0, 10) + '***',
      userAgent: userAgent.substring(0, 50),
      timestamp: new Date().toISOString()
    })

    // Input validation
    if (!message || typeof message !== 'string') {
      console.warn('Invalid or missing message in chat request')
      return new Response(
        JSON.stringify({ error: 'Message is required and must be a string' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Sanitize input
    const sanitizedMessage = sanitizeChatInput(message)
    
    if (!sanitizedMessage || sanitizedMessage.length < 1) {
      console.warn('Message too short after sanitization')
      return new Response(
        JSON.stringify({ error: 'Message is too short' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Rate limiting check
    const rateLimitKey = `chat-${clientIP}-${Math.floor(Date.now() / (5 * 60 * 1000))}`
    if (isChatRateLimited(rateLimitKey)) {
      console.warn('Chat rate limit exceeded for:', clientIP.substring(0, 10))
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please wait before sending another message.' }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Handle email composition requests immediately
    if (isEmailRequest(sanitizedMessage)) {
      console.log('Email request detected, triggering email composer')
      return new Response(
        JSON.stringify(createEmailResponse()),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    }

    // Regular chat response with sanitized input
    const aiResponse = await callOpenAI(sanitizedMessage, careerKnowledge)

    // Security logging for successful chat
    console.log('Chat response generated successfully:', {
      responseLength: aiResponse.content?.length || 0,
      timestamp: new Date().toISOString()
    })

    return new Response(
      JSON.stringify({ content: aiResponse.content }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in chat function:', error)
    
    // Security logging for errors
    console.error('Chat function error details:', {
      error: error.message,
      stack: error.stack?.substring(0, 500),
      timestamp: new Date().toISOString()
    })
    
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
