
-- Add video URL fields to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN intro_video_url_en TEXT,
ADD COLUMN intro_video_url_sv TEXT;
