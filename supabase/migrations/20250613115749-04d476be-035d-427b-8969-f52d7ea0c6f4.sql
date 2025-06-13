
-- Create a public function to get profile video URLs without authentication requirements
CREATE OR REPLACE FUNCTION public.get_public_profile_videos(user_id_param uuid)
RETURNS TABLE(
  intro_video_url_en text,
  intro_video_url_sv text,
  full_name text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT 
    p.intro_video_url_en,
    p.intro_video_url_sv,
    p.full_name
  FROM public.profiles p
  WHERE p.id = user_id_param
  LIMIT 1;
$function$
