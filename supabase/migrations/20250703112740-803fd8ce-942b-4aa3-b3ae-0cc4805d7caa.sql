CREATE OR REPLACE FUNCTION public.get_public_opportunity_with_id(subdomain_param text)
 RETURNS TABLE(id uuid, opportunity_id text, name text, subdomain text, theme_id text, company_name text, target_role text, status text, user_id uuid, is_passcode_protected boolean, access_passcode text, intro_video_url_en text, intro_video_url_sv text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT 
    o.id,
    o.opportunity_id,
    o.name,
    o.subdomain,
    o.theme_id,
    o.company_name,
    o.target_role,
    o.status,
    o.user_id,
    o.is_passcode_protected,
    CASE 
      WHEN o.is_passcode_protected = true THEN o.access_passcode
      ELSE NULL 
    END as access_passcode,
    o.intro_video_url_en,
    o.intro_video_url_sv
  FROM public.opportunities o
  WHERE o.subdomain = subdomain_param 
    AND o.status = 'published'
  LIMIT 1;
$function$