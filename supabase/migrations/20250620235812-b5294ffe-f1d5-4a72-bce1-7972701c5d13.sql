
-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public can view profiles by profile_id" ON public.profiles;

DROP POLICY IF EXISTS "Users can view their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can create their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can update their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can delete their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Public can view published opportunities" ON public.opportunities;

DROP POLICY IF EXISTS "Users can view their own themes" ON public.themes;
DROP POLICY IF EXISTS "Users can create their own themes" ON public.themes;
DROP POLICY IF EXISTS "Users can update their own themes" ON public.themes;
DROP POLICY IF EXISTS "Users can delete their own themes" ON public.themes;
DROP POLICY IF EXISTS "Public can view themes" ON public.themes;

DROP POLICY IF EXISTS "Users can view their own custom domains" ON public.custom_domains;
DROP POLICY IF EXISTS "Users can create their own custom domains" ON public.custom_domains;
DROP POLICY IF EXISTS "Users can update their own custom domains" ON public.custom_domains;
DROP POLICY IF EXISTS "Users can delete their own custom domains" ON public.custom_domains;
DROP POLICY IF EXISTS "Public can view verified custom domains" ON public.custom_domains;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_domains ENABLE ROW LEVEL SECURITY;

-- Profiles table policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Allow public read access to profiles by profile_id for opportunity resolution
CREATE POLICY "Public can view profiles by profile_id" 
  ON public.profiles 
  FOR SELECT 
  USING (true);

-- Opportunities table policies
CREATE POLICY "Users can view their own opportunities" 
  ON public.opportunities 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own opportunities" 
  ON public.opportunities 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own opportunities" 
  ON public.opportunities 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own opportunities" 
  ON public.opportunities 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Allow public read access to published opportunities for presentation
CREATE POLICY "Public can view published opportunities" 
  ON public.opportunities 
  FOR SELECT 
  USING (status = 'published');

-- Themes table policies  
CREATE POLICY "Users can view their own themes" 
  ON public.themes 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own themes" 
  ON public.themes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own themes" 
  ON public.themes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own themes" 
  ON public.themes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Allow public read access to themes for opportunity presentation
CREATE POLICY "Public can view themes" 
  ON public.themes 
  FOR SELECT 
  USING (true);

-- Custom domains policies
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

-- Allow public read access to verified custom domains for domain resolution
CREATE POLICY "Public can view verified custom domains" 
  ON public.custom_domains 
  FOR SELECT 
  USING (is_verified = true);
