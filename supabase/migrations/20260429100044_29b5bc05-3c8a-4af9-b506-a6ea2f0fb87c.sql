
-- Storage bucket for animal documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('animal-documents', 'animal-documents', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies on storage.objects for this bucket
CREATE POLICY "Animal docs are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'animal-documents');

CREATE POLICY "Users upload to own animal docs folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'animal-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users update own animal docs"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'animal-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users delete own animal docs"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'animal-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Table to associate documents to a specific animal
CREATE TABLE public.animal_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id UUID NOT NULL REFERENCES public.animals(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL,
  category TEXT NOT NULL DEFAULT 'other', -- 'health_book' | 'other'
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.animal_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own animal documents"
ON public.animal_documents FOR SELECT
USING (auth.uid() = owner_id);

CREATE POLICY "Users insert own animal documents"
ON public.animal_documents FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users delete own animal documents"
ON public.animal_documents FOR DELETE
USING (auth.uid() = owner_id);

CREATE INDEX idx_animal_documents_animal ON public.animal_documents(animal_id);
CREATE INDEX idx_animal_documents_owner ON public.animal_documents(owner_id);
