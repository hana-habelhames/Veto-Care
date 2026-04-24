-- Adoption listings table
CREATE TABLE public.adoption_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vet_id UUID NOT NULL,
  animal_name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  age TEXT,
  description TEXT,
  photo_url TEXT,
  clinic_name TEXT,
  clinic_phone TEXT,
  clinic_address TEXT,
  clinic_city TEXT,
  status TEXT NOT NULL DEFAULT 'available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.adoption_listings ENABLE ROW LEVEL SECURITY;

-- Anyone (even anonymous) can see available listings
CREATE POLICY "Available listings are public"
ON public.adoption_listings FOR SELECT
USING (status = 'available' OR auth.uid() = vet_id);

CREATE POLICY "Vets can insert their own listings"
ON public.adoption_listings FOR INSERT
WITH CHECK (auth.uid() = vet_id);

CREATE POLICY "Vets can update their own listings"
ON public.adoption_listings FOR UPDATE
USING (auth.uid() = vet_id);

CREATE POLICY "Vets can delete their own listings"
ON public.adoption_listings FOR DELETE
USING (auth.uid() = vet_id);

CREATE TRIGGER update_adoption_listings_updated_at
BEFORE UPDATE ON public.adoption_listings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for adoption photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('adoption-photos', 'adoption-photos', true);

CREATE POLICY "Adoption photos are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'adoption-photos');

CREATE POLICY "Authenticated users can upload adoption photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'adoption-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own adoption photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'adoption-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own adoption photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'adoption-photos' AND auth.uid()::text = (storage.foldername(name))[1]);