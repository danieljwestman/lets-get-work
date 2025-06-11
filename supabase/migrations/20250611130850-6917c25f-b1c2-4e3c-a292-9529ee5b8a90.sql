
-- Insert English experimental text for lovable theme
INSERT INTO public.translations (theme_id, language, translation_key, published_value, draft_value, user_id)
VALUES (
  'lovable',
  'en', 
  'footer.experimental',
  'This is an experimental showcase project that reflects Daniel''s passion for crafting creative and purposeful digital experiences.',
  'This is an experimental showcase project that reflects Daniel''s passion for crafting creative and purposeful digital experiences.',
  (SELECT id FROM auth.users LIMIT 1)
)
ON CONFLICT (theme_id, language, translation_key) 
DO UPDATE SET 
  published_value = EXCLUDED.published_value,
  draft_value = EXCLUDED.draft_value,
  updated_at = now();

-- Insert Swedish experimental text for lovable theme
INSERT INTO public.translations (theme_id, language, translation_key, published_value, draft_value, user_id)
VALUES (
  'lovable',
  'sv',
  'footer.experimental', 
  'Denna webapp är ett experimentellt showcase-projekt som speglar Daniels passion för att skapa kreativa och meningsfulla digitala upplevelser.',
  'Denna webapp är ett experimentellt showcase-projekt som speglar Daniels passion för att skapa kreativa och meningsfulla digitala upplevelser.',
  (SELECT id FROM auth.users LIMIT 1)
)
ON CONFLICT (theme_id, language, translation_key)
DO UPDATE SET 
  published_value = EXCLUDED.published_value,
  draft_value = EXCLUDED.draft_value,
  updated_at = now();

-- Insert English experimental text for default theme (in case it's needed)
INSERT INTO public.translations (theme_id, language, translation_key, published_value, draft_value, user_id)
VALUES (
  'default',
  'en',
  'footer.experimental',
  'This is an experimental showcase project that reflects Daniel''s passion for crafting creative and purposeful digital experiences.',
  'This is an experimental showcase project that reflects Daniel''s passion for crafting creative and purposeful digital experiences.',
  (SELECT id FROM auth.users LIMIT 1)
)
ON CONFLICT (theme_id, language, translation_key)
DO UPDATE SET 
  published_value = EXCLUDED.published_value,
  draft_value = EXCLUDED.draft_value,
  updated_at = now();

-- Insert Swedish experimental text for default theme (in case it's needed)
INSERT INTO public.translations (theme_id, language, translation_key, published_value, draft_value, user_id)
VALUES (
  'default',
  'sv',
  'footer.experimental',
  'Denna webapp är ett experimentellt showcase-projekt som speglar Daniels passion för att skapa kreativa och meningsfulla digitala upplevelser.',
  'Denna webapp är ett experimentellt showcase-projekt som speglar Daniels passion för att skapa kreativa och meningsfulla digitala upplevelser.',
  (SELECT id FROM auth.users LIMIT 1)
)
ON CONFLICT (theme_id, language, translation_key)
DO UPDATE SET 
  published_value = EXCLUDED.published_value,
  draft_value = EXCLUDED.draft_value,
  updated_at = now();
