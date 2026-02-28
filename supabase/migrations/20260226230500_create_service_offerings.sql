CREATE TABLE IF NOT EXISTS public.service_offerings (
    id uuid DEFAULT gen_random_uuid () PRIMARY KEY,
    user_id uuid REFERENCES public.profiles (id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    specialty text NOT NULL,
    contact text NOT NULL,
    created_at timestamp
    with
        time zone DEFAULT now(),
        updated_at timestamp
    with
        time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.service_offerings ENABLE ROW LEVEL SECURITY;

-- Policies for service_offerings
CREATE POLICY "Service offerings are viewable by everyone." ON public.service_offerings FOR
SELECT USING (true);

CREATE POLICY "Users can insert their own service offerings." ON public.service_offerings FOR
INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "Users can update their own service offerings." ON public.service_offerings FOR
UPDATE USING (auth.uid () = user_id);

CREATE POLICY "Users can delete their own service offerings." ON public.service_offerings FOR DELETE USING (auth.uid () = user_id);

CREATE TABLE IF NOT EXISTS public.service_offering_collaboration_requests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    service_offering_id uuid REFERENCES public.service_offerings(id) ON DELETE CASCADE NOT NULL,
    requester_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    owner_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'accepted'::text, 'rejected'::text, 'cancelled'::text])),
    created_at timestamp with time zone DEFAULT now(),
    responded_at timestamp with time zone
);

ALTER TABLE public.service_offering_collaboration_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own requests and requests received." ON public.service_offering_collaboration_requests FOR
SELECT USING (
        auth.uid () = requester_id
        OR auth.uid () = owner_id
    );

CREATE POLICY "Users can insert requests." ON public.service_offering_collaboration_requests FOR
INSERT
WITH
    CHECK (auth.uid () = requester_id);

CREATE POLICY "Users can update requests they sent or received." ON public.service_offering_collaboration_requests FOR
UPDATE USING (
    auth.uid () = requester_id
    OR auth.uid () = owner_id
);