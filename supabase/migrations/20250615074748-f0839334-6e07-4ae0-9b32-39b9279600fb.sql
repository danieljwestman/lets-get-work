
-- Add profile_id to profiles table with unique constraint
ALTER TABLE public.profiles 
ADD COLUMN profile_id TEXT UNIQUE;

-- Create index for performance
CREATE UNIQUE INDEX idx_profiles_profile_id ON public.profiles(profile_id);

-- Add constraint to ensure profile_id is URL-friendly (lowercase alphanumeric, hyphens, underscores)
ALTER TABLE public.profiles 
ADD CONSTRAINT profile_id_format CHECK (profile_id ~ '^[a-z0-9_-]+$');

-- Remove subdomain column from opportunities table
ALTER TABLE public.opportunities 
DROP COLUMN IF EXISTS subdomain;

-- Create custom_domains table
CREATE TABLE public.custom_domains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL UNIQUE,
  target_type TEXT NOT NULL CHECK (target_type IN ('profile', 'opportunity')),
  target_profile_id TEXT,
  target_opportunity_id TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verification_token TEXT,
  ssl_status TEXT DEFAULT 'pending' CHECK (ssl_status IN ('pending', 'active', 'failed')),
  dns_configured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_target CHECK (
    (target_type = 'profile' AND target_profile_id IS NOT NULL AND target_opportunity_id IS NULL) OR
    (target_type = 'opportunity' AND target_profile_id IS NOT NULL AND target_opportunity_id IS NOT NULL)
  )
);

-- Enable RLS on custom_domains table
ALTER TABLE public.custom_domains ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for custom_domains
CREATE POLICY "Users can view their own custom domains" 
  ON public.custom_domains 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own custom domains" 
  ON public.custom_domains 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom domains" 
  ON public.custom_domains 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom domains" 
  ON public.custom_domains 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Update the get_public_opportunity function to work with profile_id instead of subdomain
CREATE OR REPLACE FUNCTION public.get_public_opportunity_by_profile(profile_id_param text, opportunity_id_param text)
 RETURNS TABLE(id uuid, opportunity_id text, name text, theme_id text, company_name text, target_role text, status text, user_id uuid, is_passcode_protected boolean, access_passcode text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT 
    o.id,
    o.opportunity_id,
    o.name,
    o.theme_id,
    o.company_name,
    o.target_role,
    o.status,
    o.user_id,
    o.is_passcode_protected,
    CASE 
      WHEN o.is_passcode_protected = true THEN o.access_passcode
      ELSE NULL 
    END as access_passcode
  FROM public.opportunities o
  JOIN public.profiles p ON p.id = o.user_id
  WHERE p.profile_id = profile_id_param 
    AND o.opportunity_id = opportunity_id_param
    AND o.status = 'published'
  LIMIT 1;
$function$;

-- Create function to get profile by profile_id
CREATE OR REPLACE FUNCTION public.get_public_profile_by_profile_id(profile_id_param text)
 RETURNS TABLE(id uuid, profile_id text, full_name text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT 
    p.id,
    p.profile_id,
    p.full_name
  FROM public.profiles p
  WHERE p.profile_id = profile_id_param
  LIMIT 1;
$function$;

-- Create function to resolve custom domain
CREATE OR REPLACE FUNCTION public.resolve_custom_domain(domain_param text)
 RETURNS TABLE(user_id uuid, target_type text, target_profile_id text, target_opportunity_id text, is_verified boolean)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT 
    cd.user_id,
    cd.target_type,
    cd.target_profile_id,
    cd.target_opportunity_id,
    cd.is_verified
  FROM public.custom_domains cd
  WHERE cd.domain = domain_param 
    AND cd.is_verified = true
  LIMIT 1;
$function$;
