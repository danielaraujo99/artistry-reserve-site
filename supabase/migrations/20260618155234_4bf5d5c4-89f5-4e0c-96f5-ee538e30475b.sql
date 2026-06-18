
-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin','staff');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role=_role)
$$;

CREATE POLICY "users see own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- TIMESTAMP HELPER
CREATE OR REPLACE FUNCTION public.tg_set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- SERVICES
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text,
  description text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  duration_min integer NOT NULL DEFAULT 60,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "admin manage services" ON public.services FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_services_upd BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- PROFESSIONALS
CREATE TABLE public.professionals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role_title text,
  bio text,
  photo_url text,
  specialties text[] DEFAULT '{}',
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.professionals TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.professionals TO authenticated;
GRANT ALL ON public.professionals TO service_role;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read pros" ON public.professionals FOR SELECT USING (true);
CREATE POLICY "admin manage pros" ON public.professionals FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_pros_upd BEFORE UPDATE ON public.professionals FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- CLIENTS
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  email text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin clients" ON public.clients FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_clients_upd BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- APPOINTMENTS
CREATE TYPE public.appt_status AS ENUM ('pending','confirmed','done','cancelled');

CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_phone text,
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  service_name text NOT NULL,
  professional_id uuid REFERENCES public.professionals(id) ON DELETE SET NULL,
  professional_name text NOT NULL,
  appt_date date NOT NULL,
  appt_time time NOT NULL,
  price numeric(10,2) DEFAULT 0,
  status public.appt_status NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.appointments TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can create appt" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "admin read appt" ON public.appointments FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update appt" ON public.appointments FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete appt" ON public.appointments FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_appt_upd BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- BLOCKED SLOTS
CREATE TABLE public.blocked_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid REFERENCES public.professionals(id) ON DELETE CASCADE,
  block_date date NOT NULL,
  block_time time,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blocked_slots TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blocked_slots TO authenticated;
GRANT ALL ON public.blocked_slots TO service_role;
ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read blocked" ON public.blocked_slots FOR SELECT USING (true);
CREATE POLICY "admin manage blocked" ON public.blocked_slots FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- GALLERY
CREATE TABLE public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  title text,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.gallery_items TO authenticated;
GRANT ALL ON public.gallery_items TO service_role;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read gallery" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "admin manage gallery" ON public.gallery_items FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- FINANCE
CREATE TYPE public.tx_type AS ENUM ('income','expense');

CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.tx_type NOT NULL,
  category text,
  description text,
  amount numeric(10,2) NOT NULL,
  tx_date date NOT NULL DEFAULT current_date,
  due_date date,
  paid boolean NOT NULL DEFAULT true,
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin tx" ON public.transactions FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_tx_upd BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- SEED SERVICES & PROFESSIONALS & GALLERY
INSERT INTO public.services (name, category, price, duration_min, sort_order) VALUES
('Escova','Cabelo',80,45,1),
('Corte de cabelo','Cabelo',120,60,2),
('Coloração','Cor',280,120,3),
('Mechas','Cor',450,180,4),
('Tratamentos Capilares','Tratamento',180,60,5),
('Babyliss','Cabelo',90,45,6),
('Alisamento','Tratamento',350,150,7);

INSERT INTO public.professionals (name, role_title, bio, photo_url, specialties, sort_order) VALUES
('Elaine Hahn','Hair Designer & Colorista','Com mais de 10 anos de profissão, Elaine Hahn é referência em técnica e sofisticação.','/main/Elaine.png',ARRAY['Cortes','Coloração','Mechas','Pivot Point DCF 1 e 2','Chaves da Cor L''Oréal'],1),
('Verônica Pereira de Oliveira','Designer de Mechas & Colorista','Com 18 anos de trajetória, expertise em Design de Mechas e Colorimetria, aliando técnica, inovação e excelência.','/main/Veronica.png',ARRAY['Design de Mechas','Colorimetria','Terapia Capilar','Escovaria Avançada'],2);

INSERT INTO public.gallery_items (image_url, sort_order) VALUES
('/gallery/destaque-001.jpg',1),
('/gallery/destaque-002.jpeg',2),
('/gallery/destaque-003.jpeg',3),
('/gallery/destaque-004.jpeg',4),
('/gallery/destaque-005.jpeg',5),
('/gallery/destaque-006.jpeg',6),
('/gallery/destaque-007.jpeg',7),
('/gallery/destaque-008.jpeg',8),
('/gallery/destaque-009.jpeg',9);
