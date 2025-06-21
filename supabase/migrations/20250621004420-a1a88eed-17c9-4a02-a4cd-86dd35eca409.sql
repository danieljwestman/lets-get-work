
-- Update the verify_opportunity_passcode function to use profile_id and opportunity_id instead of subdomain
CREATE OR REPLACE FUNCTION public.verify_opportunity_passcode(profile_id_param text, opportunity_id_param text, passcode_param text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT 
    CASE 
      WHEN o.access_passcode = passcode_param THEN true
      ELSE false
    END
  FROM public.opportunities o
  JOIN public.profiles p ON p.id = o.user_id
  WHERE p.profile_id = profile_id_param 
    AND o.opportunity_id = opportunity_id_param
    AND o.status = 'published'
    AND o.is_passcode_protected = true
  LIMIT 1;
$function$;

-- Drop the old subdomain-based function since we're not using subdomains anymore
DROP FUNCTION IF EXISTS public.verify_opportunity_passcode(subdomain_param text, passcode_param text);
