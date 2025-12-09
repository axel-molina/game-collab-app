-- Add foreign key relationship from projects to profiles
ALTER TABLE public.projects 
ADD CONSTRAINT projects_user_id_fkey_profiles 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;