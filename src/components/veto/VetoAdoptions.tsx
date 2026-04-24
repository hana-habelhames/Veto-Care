import { useEffect, useRef, useState } from "react";
import { Heart, Plus, Upload, CheckCircle2, Trash2, PawPrint, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type Listing = {
  id: string;
  vet_id: string;
  animal_name: string;
  species: string;
  breed: string | null;
  age: string | null;
  description: string | null;
  photo_url: string | null;
  clinic_name: string | null;
  clinic_phone: string | null;
  clinic_address: string | null;
  clinic_city: string | null;
  status: string;
  created_at: string;
};

export function VetoAdoptions() {
  const { profile } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!profile) return;
    const { data } = await supabase
      .from("adoption_listings")
      .select("*")
      .eq("vet_id", profile.id)
      .order("created_at", { ascending: false });
    setListings((data as Listing[]) ?? []);
  };

  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, [profile?.id]);

  const markAdopted = async (id: string) => {
    const { error } = await supabase
      .from("adoption_listings")
      .update({ status: "adopted" })
      .eq("id", id);
    if (error) { toast.error("Erreur", { description: error.message }); return; }
    toast.success("Annonce marquée comme adoptée 🎉");
    refresh();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("adoption_listings").delete().eq("id", id);
    if (error) { toast.error("Erreur", { description: error.message }); return; }
    toast.success("Annonce supprimée");
    refresh();
  };

  const available = listings.filter((l) => l.status === "available");
  const adopted = listings.filter((l) => l.status === "adopted");

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-title mb-1 flex items-center gap-2">
            <Heart className="h-6 w-6 text-rose-500" /> Annonces Adoption
          </h1>
          <p className="text-muted-foreground">Proposez des animaux à l'adoption depuis votre cabinet.</p>
        </div>
        <Button
          onClick={() => setShowForm((v) => !v)}
          className="bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 rounded-xl gap-2"
        >
          <Plus className="h-4 w-4" /> {showForm ? "Fermer" : "Nouvelle annonce"}
        </Button>
      </div>

      {showForm && (
        <NewListingForm
          onCreated={() => { refresh(); setShowForm(false); }}
          loading={loading}
          setLoading={setLoading}
        />
      )}

      <section className="mt-6">
        <h2 className="font-semibold text-brand-title mb-3">Disponibles ({available.length})</h2>
        {available.length === 0 ? (
          <div className="bg-card rounded-2xl border border-brand-border p-10 text-center">
            <PawPrint className="h-10 w-10 text-brand-accent mx-auto mb-3" />
            <p className="text-brand-title font-semibold mb-1">Aucune annonce active</p>
            <p className="text-muted-foreground text-sm">Cliquez sur "Nouvelle annonce" pour commencer.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {available.map((l) => (
              <ListingCard key={l.id} listing={l} onAdopted={() => markAdopted(l.id)} onDelete={() => remove(l.id)} />
            ))}
          </div>
        )}
      </section>

      {adopted.length > 0 && (
        <section className="mt-8">
          <h2 className="font-semibold text-brand-title mb-3">Adoptés ({adopted.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {adopted.map((l) => (
              <ListingCard key={l.id} listing={l} onDelete={() => remove(l.id)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ListingCard({ listing, onAdopted, onDelete }: { listing: Listing; onAdopted?: () => void; onDelete: () => void }) {
  const isAdopted = listing.status === "adopted";
  return (
    <div className={`bg-card rounded-2xl border border-brand-border overflow-hidden shadow-sm ${isAdopted ? "opacity-70" : ""}`}>
      <div className="aspect-[4/3] bg-brand-soft overflow-hidden relative">
        {listing.photo_url ? (
          <img src={listing.photo_url} alt={listing.animal_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PawPrint className="h-12 w-12 text-brand-accent/40" />
          </div>
        )}
        {isAdopted && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 text-xs font-bold bg-emerald-500 text-white rounded-full px-2.5 py-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Adopté
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="font-bold text-brand-title">{listing.animal_name}</p>
        <p className="text-sm text-muted-foreground">{listing.species}{listing.breed && ` · ${listing.breed}`}{listing.age && ` · ${listing.age}`}</p>
        {listing.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{listing.description}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          {!isAdopted && onAdopted && (
            <button
              onClick={onAdopted}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 text-white text-xs font-semibold px-3 py-2 hover:bg-emerald-600 transition"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Marqué comme adopté
            </button>
          )}
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-1.5 rounded-xl bg-card border border-brand-border text-brand-title text-xs font-semibold px-3 py-2 hover:border-rose-300 hover:text-rose-600 transition"
          >
            <Trash2 className="h-3.5 w-3.5" /> Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

function NewListingForm({ onCreated, loading, setLoading }: { onCreated: () => void; loading: boolean; setLoading: (b: boolean) => void }) {
  const { profile } = useAuth();
  const [animalName, setAnimalName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhotoFile(f);
    setPhotoPreview(URL.createObjectURL(f));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setLoading(true);

    let photo_url: string | null = null;
    if (photoFile) {
      const ext = photoFile.name.split(".").pop() ?? "jpg";
      const path = `${profile.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("adoption-photos").upload(path, photoFile);
      if (upErr) {
        toast.error("Erreur upload photo", { description: upErr.message });
        setLoading(false);
        return;
      }
      photo_url = supabase.storage.from("adoption-photos").getPublicUrl(path).data.publicUrl;
    }

    const { error } = await supabase.from("adoption_listings").insert({
      vet_id: profile.id,
      animal_name: animalName.trim(),
      species: species.trim(),
      breed: breed.trim() || null,
      age: age.trim() || null,
      description: description.trim() || null,
      photo_url,
      clinic_name: profile.clinic_name,
      clinic_phone: profile.phone,
      clinic_address: profile.address,
      clinic_city: profile.city,
    });
    setLoading(false);
    if (error) { toast.error("Erreur", { description: error.message }); return; }
    toast.success("Annonce publiée 🐾");
    setAnimalName(""); setSpecies(""); setBreed(""); setAge(""); setDescription(""); setPhotoFile(null); setPhotoPreview(null);
    onCreated();
  };

  return (
    <form onSubmit={submit} className="bg-card rounded-2xl border border-brand-border p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-brand-title text-sm">Nom de l'animal *</Label>
          <Input value={animalName} onChange={(e) => setAnimalName(e.target.value)} required maxLength={80} className="rounded-xl" placeholder="Mia" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-brand-title text-sm">Espèce *</Label>
          <Input value={species} onChange={(e) => setSpecies(e.target.value)} required maxLength={80} className="rounded-xl" placeholder="Chat, Chien, Lapin, Perroquet..." />
        </div>
        <div className="space-y-1.5">
          <Label className="text-brand-title text-sm">Race</Label>
          <Input value={breed} onChange={(e) => setBreed(e.target.value)} maxLength={80} className="rounded-xl" placeholder="Berger algérien" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-brand-title text-sm">Âge</Label>
          <Input value={age} onChange={(e) => setAge(e.target.value)} maxLength={40} className="rounded-xl" placeholder="2 ans" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-brand-title text-sm">Description / Caractère</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={1000} className="rounded-xl resize-none" placeholder="Sociable, joueur, vacciné, stérilisé..." />
      </div>

      <div className="space-y-1.5">
        <Label className="text-brand-title text-sm">Photo</Label>
        <div className="flex items-center gap-3 flex-wrap">
          <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl border border-dashed border-brand-border bg-background px-4 py-2.5 text-sm text-brand-title hover:border-brand-accent transition">
            <Upload className="h-4 w-4" /> Choisir une photo
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickFile} />
          {photoPreview && (
            <img src={photoPreview} alt="aperçu" className="h-16 w-16 rounded-xl object-cover border border-brand-border" />
          )}
        </div>
      </div>

      <Button type="submit" disabled={loading} className="bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 rounded-xl">
        {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Publication...</> : "Publier l'annonce"}
      </Button>
    </form>
  );
}
