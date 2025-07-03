-- Add video URL fields to the opportunities table
ALTER TABLE public.opportunities 
ADD COLUMN intro_video_url_en TEXT,
ADD COLUMN intro_video_url_sv TEXT;