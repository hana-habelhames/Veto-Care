
-- Enum pour les rôles
CREATE TYPE public.user_role AS ENUM ('client', 'veto');

-- Table profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  city TEXT,
  address TEXT,
  role public.user_role NOT NULL DEFAULT 'client',
  clinic_name TEXT,
  emergency_24_7 BOOLEAN DEFAULT false,
  home_visit BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Table animals
CREATE TABLE public.animals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  sex TEXT,
  birth_date DATE,
  insured BOOLEAN DEFAULT false,
  sterilized BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.animals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own animals"
  ON public.animals FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users insert own animals"
  ON public.animals FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users update own animals"
  ON public.animals FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users delete own animals"
  ON public.animals FOR DELETE USING (auth.uid() = owner_id);

-- Table appointments
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  animal_id UUID REFERENCES public.animals(id) ON DELETE SET NULL,
  clinic_id TEXT NOT NULL,
  clinic_name TEXT NOT NULL,
  clinic_city TEXT,
  clinic_address TEXT,
  clinic_phone TEXT,
  vet_name TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  reason TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own appointments"
  ON public.appointments FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users insert own appointments"
  ON public.appointments FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users update own appointments"
  ON public.appointments FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users delete own appointments"
  ON public.appointments FOR DELETE USING (auth.uid() = owner_id);

-- Trigger update updated_at sur profiles
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger auto-création de profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'client')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
