-- Clean up old types if they exist (requires dropping tables first)
DROP TABLE IF EXISTS public.matches;
DROP TABLE IF EXISTS public.requests;
DROP TABLE IF EXISTS public.users;
DROP TYPE IF EXISTS public.user_role;
DROP TYPE IF EXISTS public.request_status;

-- Create users table (extends auth.users)
CREATE TYPE public.user_role AS ENUM ('sppg', 'sekolah', 'peternak_manggot', 'peternak_hewan', 'waste_to_energy');

CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role public.user_role NOT NULL,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    capacity NUMERIC NOT NULL DEFAULT 0, -- Generic capacity/stock
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for public.users
CREATE POLICY "Users can view all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Enable insert for authenticated users" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Create requests table
CREATE TYPE public.request_status AS ENUM ('PENDING', 'MATCHED');

CREATE TABLE public.requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    item_type TEXT NOT NULL, -- e.g., 'LIMBAH', 'MAGGOT', 'ENERGI', 'PUPUK'
    action_type TEXT NOT NULL, -- 'OFFER' or 'NEED'
    volume NUMERIC NOT NULL,
    status public.request_status DEFAULT 'PENDING' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view requests" ON public.requests FOR SELECT USING (true);
CREATE POLICY "Users can insert their own requests" ON public.requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own requests" ON public.requests FOR UPDATE USING (auth.uid() = user_id);

-- Create matches table
CREATE TABLE public.matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE UNIQUE NOT NULL,
    partner_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    matched_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert matches" ON public.matches FOR INSERT WITH CHECK (auth.role() = 'authenticated');


-- Create trigger to insert into public.users when a new auth user registers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, role, name, city, address, capacity, avatar)
  VALUES (
    new.id,
    (new.raw_user_meta_data->>'role')::public.user_role,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'address',
    COALESCE((new.raw_user_meta_data->>'capacity')::numeric, 0),
    new.raw_user_meta_data->>'avatar'
  ) ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- For the Matchmaking Panel Simulation
DROP TABLE IF EXISTS public.active_matchmaking;
CREATE TABLE public.active_matchmaking (
    user_id UUID PRIMARY KEY,
    name TEXT,
    role TEXT,
    category TEXT,
    location TEXT, 
    status TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS and allow anonymous access for the simulation
ALTER TABLE public.active_matchmaking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for active_matchmaking" ON public.active_matchmaking FOR ALL USING (true) WITH CHECK (true);

DROP FUNCTION IF EXISTS public.find_nearest_partners(double precision, double precision, double precision, text[]);
DROP FUNCTION IF EXISTS public.find_nearest_partners(double precision, double precision, double precision, text[], text);

CREATE OR REPLACE FUNCTION public.find_nearest_partners(
    user_lat double precision,
    user_lng double precision,
    search_radius_meters double precision,
    target_roles text[],
    p_city text DEFAULT NULL
)
RETURNS TABLE (
    id uuid,
    name text,
    role text,
    category text,
    stock text,
    distance double precision,
    lat double precision,
    lng double precision,
    is_online boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH online_users AS (
        SELECT 
            u.id, u.name, u.role::text, 'General'::text as category, 'Tersedia'::text as stock,
            (random() * 5000)::double precision as distance,
            -6.9850 + (random() * 0.1 - 0.05) as lat,
            109.1400 + (random() * 0.1 - 0.05) as lng,
            true as is_online
        FROM public.active_matchmaking a
        JOIN public.users u ON u.id = a.user_id
        WHERE u.role::text = ANY(target_roles)
          AND (p_city IS NULL OR u.city = p_city)
    ),
    offline_users AS (
        SELECT 
            u.id, u.name, u.role::text, 'General'::text as category, 'Tersedia'::text as stock,
            (random() * 15000)::double precision as distance,
            -6.9850 + (random() * 0.1 - 0.05) as lat,
            109.1400 + (random() * 0.1 - 0.05) as lng,
            false as is_online
        FROM public.users u
        WHERE u.role::text = ANY(target_roles)
          AND (p_city IS NULL OR u.city = p_city)
          AND u.id NOT IN (SELECT ou.id FROM online_users ou)
        ORDER BY random()
        LIMIT 5
    )
    SELECT * FROM online_users
    UNION ALL
    SELECT * FROM offline_users
    LIMIT 5;
END;
$$;


-- RPC function for bi-directional matchmaking
CREATE OR REPLACE FUNCTION public.process_matchmaking(
    p_user_id UUID,
    p_item_type TEXT,
    p_action_type TEXT,
    p_volume NUMERIC
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_existing_request_id UUID;
    v_partner_id UUID;
    v_request_id UUID;
    v_match_id UUID;
    v_user_role public.user_role;
    v_target_roles public.user_role[];
BEGIN
    -- 1. Check for duplicates (same user, same item, same action today)
    SELECT id INTO v_existing_request_id
    FROM public.requests
    WHERE user_id = p_user_id 
      AND item_type = p_item_type
      AND action_type = p_action_type
      AND DATE(created_at) = CURRENT_DATE
    LIMIT 1;

    IF v_existing_request_id IS NOT NULL THEN
        RAISE EXCEPTION 'Data ini sudah ditambahkan sebelumnya';
    END IF;

    -- Get user role
    SELECT role INTO v_user_role FROM public.users WHERE id = p_user_id;

    -- Determine valid partner roles based on the ecosystem
    IF p_action_type = 'OFFER' AND p_item_type = 'LIMBAH' THEN
        -- Producers offering waste -> Processors
        v_target_roles := ARRAY['peternak_manggot', 'peternak_hewan', 'waste_to_energy']::public.user_role[];
    ELSIF p_action_type = 'NEED' AND p_item_type = 'LIMBAH' THEN
        -- Processors needing waste -> Producers
        v_target_roles := ARRAY['sppg', 'sekolah']::public.user_role[];
    ELSIF p_action_type = 'OFFER' AND p_item_type IN ('MAGGOT', 'ENERGI', 'PUPUK') THEN
        -- Processors offering products -> Producers
        v_target_roles := ARRAY['sppg', 'sekolah']::public.user_role[];
    ELSIF p_action_type = 'NEED' AND p_item_type IN ('MAGGOT', 'ENERGI', 'PUPUK') THEN
        -- Producers needing products -> Processors
        v_target_roles := ARRAY['peternak_manggot', 'peternak_hewan', 'waste_to_energy']::public.user_role[];
    ELSE
        -- Fallback: anyone else
        v_target_roles := ARRAY['sppg', 'sekolah', 'peternak_manggot', 'peternak_hewan', 'waste_to_energy']::public.user_role[];
    END IF;

    -- 2. Find an available partner in the same city or globally (simplified for demo: just any target role with capacity >= volume)
    -- Actually, to make the demo robust, just find ANY user with the target role.
    SELECT id INTO v_partner_id
    FROM public.users
    WHERE role = ANY(v_target_roles)
      AND id != p_user_id
    ORDER BY random() -- Pick random partner for the demo so it feels dynamic
    LIMIT 1;

    -- 3. Create the request
    IF v_partner_id IS NOT NULL THEN
        -- Match found
        INSERT INTO public.requests (user_id, item_type, action_type, volume, status)
        VALUES (p_user_id, p_item_type, p_action_type, p_volume, 'MATCHED')
        RETURNING id INTO v_request_id;

        -- Create the match
        INSERT INTO public.matches (request_id, partner_id)
        VALUES (v_request_id, v_partner_id)
        RETURNING id INTO v_match_id;

        RETURN jsonb_build_object(
            'success', true,
            'status', 'MATCHED',
            'request_id', v_request_id,
            'match_id', v_match_id,
            'partner_id', v_partner_id
        );
    ELSE
        -- No match found, leave as pending
        INSERT INTO public.requests (user_id, item_type, action_type, volume, status)
        VALUES (p_user_id, p_item_type, p_action_type, p_volume, 'PENDING')
        RETURNING id INTO v_request_id;

        RETURN jsonb_build_object(
            'success', true,
            'status', 'PENDING',
            'request_id', v_request_id
        );
    END IF;
END;
$$;
