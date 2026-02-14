-- Create achievements table (catalog of available achievements)
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL, -- lucide-react icon name
    category TEXT NOT NULL, -- 'projects', 'social', 'content', etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_achievements table (achievements earned by users)
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements (id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, achievement_id) -- Prevent duplicate achievements
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements (user_id);

CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON public.user_achievements (achievement_id);

CREATE INDEX IF NOT EXISTS idx_achievements_category ON public.achievements (category);

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for achievements (public read)
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR
SELECT USING (true);

-- RLS Policies for user_achievements (public read, authenticated write own)
CREATE POLICY "Anyone can view user achievements" ON public.user_achievements FOR
SELECT USING (true);

CREATE POLICY "Users can insert their own achievements" ON public.user_achievements FOR
INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "Users can delete their own achievements" ON public.user_achievements FOR DELETE USING (auth.uid () = user_id);

-- Insert initial achievements
INSERT INTO
    public.achievements (
        name,
        description,
        icon,
        category
    )
VALUES (
        'Primer Proyecto',
        'Creaste tu primer proyecto',
        'Rocket',
        'projects'
    ),
    (
        'Colaborador',
        'Te uniste a un proyecto como colaborador',
        'Users',
        'social'
    ),
    (
        'Creador de Contenido',
        'Publicaste 5 posts',
        'FileText',
        'content'
    ),
    (
        'Socialite',
        'Diste 10 likes a proyectos',
        'Heart',
        'social'
    ),
    (
        'Seguidor Activo',
        'Seguiste 5 proyectos',
        'Bookmark',
        'social'
    ),
    (
        'Emprendedor',
        'Creaste 3 proyectos',
        'Briefcase',
        'projects'
    ),
    (
        'Influencer',
        'Publicaste 20 posts',
        'Megaphone',
        'content'
    ),
    (
        'Networker',
        'Seguiste 10 proyectos',
        'Network',
        'social'
    ),
    (
        'Comentarista',
        'Escribiste 10 comentarios',
        'MessageCircle',
        'social'
    ),
    (
        'Veterano',
        'Tu cuenta tiene más de 6 meses',
        'Award',
        'milestone'
    );