-- Fix security issues identified by the linter

-- Enable RLS on logos table (this was missing)
ALTER TABLE public.logos ENABLE ROW LEVEL SECURITY;

-- Create policy for logos (public read access since they're site logos)
CREATE POLICY "Anyone can view logos" 
ON public.logos 
FOR SELECT 
USING (true);

-- Drop the old users table since we're using auth.users now
DROP TABLE IF EXISTS public.users CASCADE;

-- Fix the search path issue in our function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  RETURN new;
END;
$$;