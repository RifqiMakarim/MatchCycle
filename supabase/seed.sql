-- Seed script for MatchGate based on regional-data.ts

DO $$
DECLARE
    -- Using UUID v5-like deterministic UUIDs for simplicity based on indexes
    -- Slawi: 1xx
    slw_sppg_1 UUID := '11111111-1111-1111-1111-111111111101';
    slw_sppg_2 UUID := '11111111-1111-1111-1111-111111111102';
    slw_sch_1  UUID := '11111111-1111-1111-1111-111111111103';
    slw_sch_2  UUID := '11111111-1111-1111-1111-111111111104';
    slw_sch_3  UUID := '11111111-1111-1111-1111-111111111105';
    slw_pm_1   UUID := '11111111-1111-1111-1111-111111111106';
    slw_wte_1  UUID := '11111111-1111-1111-1111-111111111107';

    -- Adiwerna: 2xx
    adw_sppg_1 UUID := '22222222-2222-2222-2222-222222222201';
    adw_sch_1  UUID := '22222222-2222-2222-2222-222222222202';
    adw_sch_2  UUID := '22222222-2222-2222-2222-222222222203';
    adw_sch_3  UUID := '22222222-2222-2222-2222-222222222204';
    adw_pm_1   UUID := '22222222-2222-2222-2222-222222222205';

    -- Talang: 3xx
    tlg_sppg_1 UUID := '33333333-3333-3333-3333-333333333301';
    tlg_sppg_2 UUID := '33333333-3333-3333-3333-333333333302';
    tlg_sch_1  UUID := '33333333-3333-3333-3333-333333333303';
    tlg_sch_2  UUID := '33333333-3333-3333-3333-333333333304';
    tlg_sch_3  UUID := '33333333-3333-3333-3333-333333333305';
    tlg_pm_1   UUID := '33333333-3333-3333-3333-333333333306';

    -- Dukuhturi: 4xx
    dkt_sppg_1 UUID := '44444444-4444-4444-4444-444444444401';
    dkt_sppg_2 UUID := '44444444-4444-4444-4444-444444444402';
    dkt_sch_1  UUID := '44444444-4444-4444-4444-444444444403';
    dkt_sch_2  UUID := '44444444-4444-4444-4444-444444444404';
    dkt_sch_3  UUID := '44444444-4444-4444-4444-444444444405';
    dkt_pm_1   UUID := '44444444-4444-4444-4444-444444444406';

    req_id UUID;
BEGIN
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

    -- Function to insert a user
    -- Usage: insert_user(id, role, name, city, address, capacity, avatar)
    -- But since plpgsql doesn't support nested functions easily without creating them globally, we'll just insert directly.

    -- SLAWI
    INSERT INTO auth.users (id, instance_id, role, aud, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at) VALUES
    (slw_sppg_1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'slw_sppg_1@matchgate.com', crypt('password123', gen_salt('bf')), now(), '{"role":"sppg", "name":"SPPG Slawi Kulon", "city":"Slawi", "address":"Slawi Kulon", "capacity":45, "avatar":"SK"}'::jsonb, now() - '10 days'::interval, now()),
    (slw_sppg_2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'slw_sppg_2@matchgate.com', crypt('password123', gen_salt('bf')), now(), '{"role":"sppg", "name":"SPPG Arjuna", "city":"Slawi", "address":"Kawasan Slawi", "capacity":30, "avatar":"SA"}'::jsonb, now() - '10 days'::interval, now()),
    (slw_sch_1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'slw_sch_1@matchgate.com', crypt('password123', gen_salt('bf')), now(), '{"role":"sekolah", "name":"SMAN 1 Slawi", "city":"Slawi", "address":"Jl. KH. Wahid Hasyim, Slawi", "capacity":25, "avatar":"S1"}'::jsonb, now() - '10 days'::interval, now()),
    (slw_sch_2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'slw_sch_2@matchgate.com', crypt('password123', gen_salt('bf')), now(), '{"role":"sekolah", "name":"SMAN 2 Slawi", "city":"Slawi", "address":"Slawi Wetan", "capacity":15, "avatar":"S2"}'::jsonb, now() - '10 days'::interval, now()),
    (slw_sch_3, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'slw_sch_3@matchgate.com', crypt('password123', gen_salt('bf')), now(), '{"role":"sekolah", "name":"SMAN 3 Slawi", "city":"Slawi", "address":"Kawasan Komplek Pendidikan", "capacity":20, "avatar":"S3"}'::jsonb, now() - '10 days'::interval, now()),
    (slw_pm_1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'slw_pm_1@matchgate.com', crypt('password123', gen_salt('bf')), now(), '{"role":"peternak_manggot", "name":"Maggot Center Slawi", "city":"Slawi", "address":"Slawi Wetan", "capacity":50, "avatar":"MC"}'::jsonb, now() - '10 days'::interval, now()),
    (slw_wte_1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'slw_wte_1@matchgate.com', crypt('password123', gen_salt('bf')), now(), '{"role":"waste_to_energy", "name":"TPA Penujah", "city":"Slawi", "address":"Penujah", "capacity":1000, "avatar":"TP"}'::jsonb, now() - '10 days'::interval, now())
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.users (id, role, name, city, address, capacity, avatar, created_at) VALUES
    (slw_sppg_1, 'sppg', 'SPPG Slawi Kulon', 'Slawi', 'Slawi Kulon', 45, 'SK', now() - '10 days'::interval),
    (slw_sppg_2, 'sppg', 'SPPG Arjuna', 'Slawi', 'Kawasan Slawi', 30, 'SA', now() - '10 days'::interval),
    (slw_sch_1, 'sekolah', 'SMAN 1 Slawi', 'Slawi', 'Jl. KH. Wahid Hasyim, Slawi', 25, 'S1', now() - '10 days'::interval),
    (slw_sch_2, 'sekolah', 'SMAN 2 Slawi', 'Slawi', 'Slawi Wetan', 15, 'S2', now() - '10 days'::interval),
    (slw_sch_3, 'sekolah', 'SMAN 3 Slawi', 'Slawi', 'Kawasan Komplek Pendidikan', 20, 'S3', now() - '10 days'::interval),
    (slw_pm_1, 'peternak_manggot', 'Maggot Center Slawi', 'Slawi', 'Slawi Wetan', 50, 'MC', now() - '10 days'::interval),
    (slw_wte_1, 'waste_to_energy', 'TPA Penujah', 'Slawi', 'Penujah', 1000, 'TP', now() - '10 days'::interval)
    ON CONFLICT (id) DO NOTHING;

    -- ADIWERNA
    INSERT INTO auth.users (id, instance_id, role, aud, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at) VALUES
    (adw_sppg_1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'adw_sppg_1@matchgate.com', crypt('password123', gen_salt('bf')), now(), '{"role":"sppg", "name":"SPPG Penarukan Adiwerna", "city":"Adiwerna", "address":"Penarukan", "capacity":60, "avatar":"PA"}'::jsonb, now(), now()),
    (adw_sch_1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'adw_sch_1@matchgate.com', crypt('password123', gen_salt('bf')), now(), '{"role":"sekolah", "name":"SMPN 1 Adiwerna Tegal", "city":"Adiwerna", "address":"Kalimati, Adiwerna", "capacity":10, "avatar":"S1"}'::jsonb, now(), now()),
    (adw_sch_2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'adw_sch_2@matchgate.com', crypt('password123', gen_salt('bf')), now(), '{"role":"sekolah", "name":"SMPN 3 Adiwerna Tegal", "city":"Adiwerna", "address":"Adiwerna", "capacity":20, "avatar":"S3"}'::jsonb, now(), now()),
    (adw_sch_3, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'adw_sch_3@matchgate.com', crypt('password123', gen_salt('bf')), now(), '{"role":"sekolah", "name":"SD Islam Pelangi Ujungrusi", "city":"Adiwerna", "address":"Ujungrusi", "capacity":12, "avatar":"SD"}'::jsonb, now(), now()),
    (adw_pm_1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'adw_pm_1@matchgate.com', crypt('password123', gen_salt('bf')), now(), '{"role":"peternak_manggot", "name":"Biomagg Adiwerna", "city":"Adiwerna", "address":"Selatan Adiwerna", "capacity":100, "avatar":"BA"}'::jsonb, now(), now())
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.users (id, role, name, city, address, capacity, avatar) VALUES
    (adw_sppg_1, 'sppg', 'SPPG Penarukan Adiwerna', 'Adiwerna', 'Penarukan', 60, 'PA'),
    (adw_sch_1, 'sekolah', 'SMPN 1 Adiwerna Tegal', 'Adiwerna', 'Kalimati, Adiwerna', 10, 'S1'),
    (adw_sch_2, 'sekolah', 'SMPN 3 Adiwerna Tegal', 'Adiwerna', 'Adiwerna', 20, 'S3'),
    (adw_sch_3, 'sekolah', 'SD Islam Pelangi Ujungrusi', 'Adiwerna', 'Ujungrusi', 12, 'SD'),
    (adw_pm_1, 'peternak_manggot', 'Biomagg Adiwerna', 'Adiwerna', 'Selatan Adiwerna', 100, 'BA')
    ON CONFLICT (id) DO NOTHING;

    -- TALANG
    INSERT INTO auth.users (id, instance_id, role, aud, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at) VALUES
    (tlg_sppg_1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'tlg_sppg_1@matchgate.com', crypt('password123', gen_salt('bf')), now(), '{"role":"sppg", "name":"SPPG Talang 02", "city":"Talang", "address":"Talang Tengah", "capacity":25, "avatar":"T2"}'::jsonb, now(), now()),
    (tlg_sppg_2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'tlg_sppg_2@matchgate.com', crypt('password123', gen_salt('bf')), now(), '{"role":"sppg", "name":"SPPG Pacul Talang", "city":"Talang", "address":"Pacul", "capacity":40, "avatar":"PT"}'::jsonb, now(), now()),
    (tlg_sch_1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'tlg_sch_1@matchgate.com', crypt('password123', gen_salt('bf')), now(), '{"role":"sekolah", "name":"SDN Talang 01", "city":"Talang", "address":"Talang", "capacity":5, "avatar":"S1"}'::jsonb, now(), now()),
    (tlg_sch_2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'tlg_sch_2@matchgate.com', crypt('password123', gen_salt('bf')), now(), '{"role":"sekolah", "name":"SMPN 1 Kramat", "city":"Talang", "address":"Kramat (Area Talang)", "capacity":15, "avatar":"K1"}'::jsonb, now(), now()),
    (tlg_sch_3, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'tlg_sch_3@matchgate.com', crypt('password123', gen_salt('bf')), now(), '{"role":"sekolah", "name":"SMPN 1 Tarub", "city":"Talang", "address":"Tarub (Area Talang)", "capacity":18, "avatar":"T1"}'::jsonb, now(), now()),
    (tlg_pm_1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'tlg_pm_1@matchgate.com', crypt('password123', gen_salt('bf')), now(), '{"role":"peternak_manggot", "name":"Maggot Center Talang", "city":"Talang", "address":"Talang", "capacity":80, "avatar":"MT"}'::jsonb, now(), now())
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.users (id, role, name, city, address, capacity, avatar) VALUES
    (tlg_sppg_1, 'sppg', 'SPPG Talang 02', 'Talang', 'Talang Tengah', 25, 'T2'),
    (tlg_sppg_2, 'sppg', 'SPPG Pacul Talang', 'Talang', 'Pacul', 40, 'PT'),
    (tlg_sch_1, 'sekolah', 'SDN Talang 01', 'Talang', 'Talang', 5, 'S1'),
    (tlg_sch_2, 'sekolah', 'SMPN 1 Kramat', 'Talang', 'Kramat (Area Talang)', 15, 'K1'),
    (tlg_sch_3, 'sekolah', 'SMPN 1 Tarub', 'Talang', 'Tarub (Area Talang)', 18, 'T1'),
    (tlg_pm_1, 'peternak_manggot', 'Maggot Center Talang', 'Talang', 'Talang', 80, 'MT')
    ON CONFLICT (id) DO NOTHING;

    -- DUKUHTURI
    INSERT INTO auth.users (id, instance_id, role, aud, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at) VALUES
    (dkt_sppg_1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dkt_sppg_1@matchgate.com', crypt('password123', gen_salt('bf')), now(), '{"role":"sppg", "name":"SPPG Dukuhturi", "city":"Dukuhturi", "address":"Dukuhturi Center", "capacity":50, "avatar":"SD"}'::jsonb, now(), now()),
    (dkt_sppg_2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dkt_sppg_2@matchgate.com', crypt('password123', gen_salt('bf')), now(), '{"role":"sppg", "name":"SPPG Pagongan 002 Dukuhturi", "city":"Dukuhturi", "address":"Pagongan", "capacity":35, "avatar":"SP"}'::jsonb, now(), now()),
    (dkt_sch_1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dkt_sch_1@matchgate.com', crypt('password123', gen_salt('bf')), now(), '{"role":"sekolah", "name":"SMKN 1 Dukuhturi", "city":"Dukuhturi", "address":"Karanganyar, Dukuhturi", "capacity":30, "avatar":"S1"}'::jsonb, now(), now()),
    (dkt_sch_2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dkt_sch_2@matchgate.com', crypt('password123', gen_salt('bf')), now(), '{"role":"sekolah", "name":"SDN Karanganyar 01", "city":"Dukuhturi", "address":"Karanganyar", "capacity":10, "avatar":"SK"}'::jsonb, now(), now()),
    (dkt_sch_3, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dkt_sch_3@matchgate.com', crypt('password123', gen_salt('bf')), now(), '{"role":"sekolah", "name":"SDN Kepandean", "city":"Dukuhturi", "address":"Kepandean", "capacity":12, "avatar":"SK"}'::jsonb, now(), now()),
    (dkt_pm_1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dkt_pm_1@matchgate.com', crypt('password123', gen_salt('bf')), now(), '{"role":"peternak_hewan", "name":"Dukuhturi Cattle Farm", "city":"Dukuhturi", "address":"Dukuhturi Barat", "capacity":200, "avatar":"DF"}'::jsonb, now(), now())
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.users (id, role, name, city, address, capacity, avatar) VALUES
    (dkt_sppg_1, 'sppg', 'SPPG Dukuhturi', 'Dukuhturi', 'Dukuhturi Center', 50, 'SD'),
    (dkt_sppg_2, 'sppg', 'SPPG Pagongan 002 Dukuhturi', 'Dukuhturi', 'Pagongan', 35, 'SP'),
    (dkt_sch_1, 'sekolah', 'SMKN 1 Dukuhturi', 'Dukuhturi', 'Karanganyar, Dukuhturi', 30, 'S1'),
    (dkt_sch_2, 'sekolah', 'SDN Karanganyar 01', 'Dukuhturi', 'Karanganyar', 10, 'SK'),
    (dkt_sch_3, 'sekolah', 'SDN Kepandean', 'Dukuhturi', 'Kepandean', 12, 'SK'),
    (dkt_pm_1, 'peternak_hewan', 'Dukuhturi Cattle Farm', 'Dukuhturi', 'Dukuhturi Barat', 200, 'DF')
    ON CONFLICT (id) DO NOTHING;

    -- CREATE TRIGGER AGAIN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

    -- Create Matches (Matchmaking History)
    -- Slawi
    req_id := gen_random_uuid();
    INSERT INTO public.requests (id, user_id, item_type, action_type, volume, status, created_at) VALUES (req_id, slw_sppg_1, 'LIMBAH', 'OFFER', 45, 'MATCHED', now() - '1 hours'::interval);
    INSERT INTO public.matches (request_id, partner_id, matched_at) VALUES (req_id, slw_pm_1, now() - '50 minutes'::interval);

    req_id := gen_random_uuid();
    INSERT INTO public.requests (id, user_id, item_type, action_type, volume, status, created_at) VALUES (req_id, slw_sch_1, 'LIMBAH', 'OFFER', 15, 'MATCHED', now() - '2 hours'::interval);
    INSERT INTO public.matches (request_id, partner_id, matched_at) VALUES (req_id, slw_wte_1, now() - '1.5 hours'::interval);

    -- Adiwerna
    req_id := gen_random_uuid();
    INSERT INTO public.requests (id, user_id, item_type, action_type, volume, status, created_at) VALUES (req_id, adw_sppg_1, 'LIMBAH', 'OFFER', 35, 'MATCHED', now() - '15 minutes'::interval);
    INSERT INTO public.matches (request_id, partner_id, matched_at) VALUES (req_id, adw_pm_1, now() - '10 minutes'::interval);
    
    req_id := gen_random_uuid();
    INSERT INTO public.requests (id, user_id, item_type, action_type, volume, status, created_at) VALUES (req_id, adw_sch_2, 'LIMBAH', 'OFFER', 10, 'MATCHED', now() - '2.5 hours'::interval);
    INSERT INTO public.matches (request_id, partner_id, matched_at) VALUES (req_id, adw_pm_1, now() - '2 hours'::interval);

    -- Talang
    req_id := gen_random_uuid();
    INSERT INTO public.requests (id, user_id, item_type, action_type, volume, status, created_at) VALUES (req_id, tlg_sppg_2, 'LIMBAH', 'OFFER', 30, 'MATCHED', now() - '20 minutes'::interval);
    INSERT INTO public.matches (request_id, partner_id, matched_at) VALUES (req_id, tlg_pm_1, now() - '15 minutes'::interval);

    req_id := gen_random_uuid();
    INSERT INTO public.requests (id, user_id, item_type, action_type, volume, status, created_at) VALUES (req_id, tlg_sch_2, 'LIMBAH', 'OFFER', 12, 'MATCHED', now() - '1.5 hours'::interval);
    INSERT INTO public.matches (request_id, partner_id, matched_at) VALUES (req_id, tlg_pm_1, now() - '1 hour'::interval);

    -- Dukuhturi
    req_id := gen_random_uuid();
    INSERT INTO public.requests (id, user_id, item_type, action_type, volume, status, created_at) VALUES (req_id, dkt_sppg_1, 'LIMBAH', 'OFFER', 25, 'MATCHED', now() - '40 minutes'::interval);
    INSERT INTO public.matches (request_id, partner_id, matched_at) VALUES (req_id, dkt_pm_1, now() - '35 minutes'::interval);

    req_id := gen_random_uuid();
    INSERT INTO public.requests (id, user_id, item_type, action_type, volume, status, created_at) VALUES (req_id, dkt_sch_1, 'LIMBAH', 'OFFER', 18, 'MATCHED', now() - '1.5 hours'::interval);
    INSERT INTO public.matches (request_id, partner_id, matched_at) VALUES (req_id, dkt_pm_1, now() - '1 hour'::interval);

    -- Some Pending ones
    req_id := gen_random_uuid();
    INSERT INTO public.requests (id, user_id, item_type, action_type, volume, status, created_at) VALUES (req_id, slw_sppg_2, 'LIMBAH', 'OFFER', 30, 'PENDING', now() - '5 hours'::interval);

    req_id := gen_random_uuid();
    INSERT INTO public.requests (id, user_id, item_type, action_type, volume, status, created_at) VALUES (req_id, tlg_sch_3, 'LIMBAH', 'OFFER', 18, 'PENDING', now() - '1 hours'::interval);

END $$;
