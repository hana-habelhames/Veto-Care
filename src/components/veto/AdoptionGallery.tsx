import { useEffect, useState } from "react";
import { Heart, PawPrint, Phone, MapPin, Building2, X, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Listing = {
  id: string;
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
};

export function AdoptionGallery() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactFor, setContactFor] = useState<Listing | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyPhone = async (e: React.MouseEvent, id: string, phone: string | null) => {
    e.stopPropagation();
    if (!phone) { toast.error("Numéro non disponible"); return; }
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedId(id);
      toast.success("Numéro copié !", { description: phone });
      setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 2000);
    } catch {
      toast.error("Impossible de copier le numéro");
    }
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("adoption_listings")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false });
      setListings((data as Listing[]) ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-title mb-1 flex items-center gap-2">
        <Heart className="h-6 w-6 text-rose-500" /> Adopter un compagnon
      </h1>
      <p className="text-muted-foreground mb-6">Des animaux proposés à l'adoption par les cabinets vétérinaires partenaires.</p>

      {loading ? (
        <div className="bg-card rounded-2xl border border-brand-border p-12 text-center text-muted-foreground">Chargement...</div>
      ) : listings.length === 0 ? (
        <div className="bg-card rounded-2xl border border-brand-border p-12 text-center">
          <PawPrint className="h-12 w-12 text-brand-accent mx-auto mb-3" />
          <p className="text-brand-title font-semibold mb-1">Aucune annonce disponible</p>
          <p className="text-muted-foreground text-sm">Revenez bientôt pour découvrir nos protégés.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((l) => (
            <div key={l.id} className="bg-card rounded-2xl border border-brand-border overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="aspect-[4/3] bg-brand-soft overflow-hidden">
                {l.photo_url ? (
                  <img src={l.photo_url} alt={l.animal_name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PawPrint className="h-12 w-12 text-brand-accent/40" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="font-bold text-brand-title text-lg">{l.animal_name}</p>
                <p className="text-sm text-muted-foreground">{l.species}{l.breed && ` · ${l.breed}`}{l.age && ` · ${l.age}`}</p>
                {l.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{l.description}</p>}
                <div className="mt-3 pt-3 border-t border-brand-border/60">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-brand-accent" /> Proposé par <span className="font-semibold text-brand-title">{l.clinic_name ?? "Cabinet vétérinaire"}</span>
                  </p>
                </div>
                <button
                  onClick={(e) => copyPhone(e, l.id, l.clinic_phone)}
                  title={l.clinic_phone ? "Cliquez pour copier le numéro" : "Numéro non disponible"}
                  className={`mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold px-3 py-2.5 transition-all ${
                    copiedId === l.id
                      ? "bg-emerald-600 text-white"
                      : "bg-brand-accent text-brand-accent-foreground hover:opacity-90"
                  }`}
                >
                  {copiedId === l.id ? (
                    <><Check className="h-4 w-4" /> Numéro copié !</>
                  ) : l.clinic_phone ? (
                    <><Phone className="h-4 w-4" /> <span className="tabular-nums">{l.clinic_phone}</span> <Copy className="h-3.5 w-3.5 opacity-80" /></>
                  ) : (
                    <><Phone className="h-4 w-4" /> Téléphone indisponible</>
                  )}
                </button>
                {l.clinic_phone && (
                  <button
                    onClick={() => setContactFor(l)}
                    className="mt-2 w-full text-xs text-muted-foreground hover:text-brand-accent transition"
                  >
                    Voir l'adresse de la clinique
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {contactFor && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setContactFor(null)} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="bg-brand-accent text-brand-accent-foreground px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <Building2 className="h-5 w-5" />
                  <h3 className="font-bold truncate">{contactFor.clinic_name ?? "Cabinet vétérinaire"}</h3>
                </div>
                <button onClick={() => setContactFor(null)} className="p-1.5 rounded-lg hover:bg-white/20"><X className="h-4 w-4" /></button>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-sm text-muted-foreground">Pour adopter <span className="font-semibold text-brand-title">{contactFor.animal_name}</span>, contactez directement le cabinet :</p>
                {contactFor.clinic_phone ? (
                  <a href={`tel:${contactFor.clinic_phone.replace(/\s/g, "")}`} className="flex items-center gap-3 rounded-xl border border-brand-border bg-background p-3 hover:border-brand-accent transition">
                    <Phone className="h-4 w-4 text-brand-accent" />
                    <span className="text-brand-title font-medium">{contactFor.clinic_phone}</span>
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Téléphone non renseigné</p>
                )}
                {(contactFor.clinic_address || contactFor.clinic_city) && (
                  <div className="flex items-start gap-3 rounded-xl border border-brand-border bg-background p-3">
                    <MapPin className="h-4 w-4 text-brand-accent mt-0.5 shrink-0" />
                    <div className="text-sm text-brand-title">
                      {contactFor.clinic_address && <p>{contactFor.clinic_address}</p>}
                      {contactFor.clinic_city && <p className="text-muted-foreground">{contactFor.clinic_city}</p>}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
