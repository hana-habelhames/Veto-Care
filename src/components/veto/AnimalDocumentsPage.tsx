import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Trash2, NotebookText, PawPrint, FileImage, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

type AnimalLite = { id: string; name: string; species: string };
type DocRow = {
  id: string;
  animal_id: string;
  category: string;
  file_name: string;
  storage_path: string;
  public_url: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
};

export function AnimalDocumentsPage() {
  const { profile } = useAuth();
  const [animals, setAnimals] = useState<AnimalLite[]>([]);
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  const refresh = async () => {
    if (!profile) return;
    setLoading(true);
    const [aRes, dRes] = await Promise.all([
      supabase.from("animals").select("id, name, species").eq("owner_id", profile.id).order("created_at", { ascending: false }),
      supabase.from("animal_documents").select("*").eq("owner_id", profile.id).order("created_at", { ascending: false }),
    ]);
    setAnimals((aRes.data as AnimalLite[]) ?? []);
    setDocs((dRes.data as DocRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, [profile?.id]);

  const handleUpload = async (animalId: string, file: File, category: "health_book" | "other") => {
    if (!profile) return;
    setUploadingFor(animalId);
    try {
      const ext = file.name.split(".").pop() || "bin";
      const path = `${profile.id}/${animalId}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("animal-documents").upload(path, file, { upsert: false });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("animal-documents").getPublicUrl(path);
      const { error: insErr } = await supabase.from("animal_documents").insert({
        animal_id: animalId,
        owner_id: profile.id,
        category,
        file_name: file.name,
        storage_path: path,
        public_url: pub.publicUrl,
        mime_type: file.type,
        size_bytes: file.size,
      });
      if (insErr) throw insErr;
      toast.success("Document ajouté");
      refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur lors de l'upload";
      toast.error("Erreur", { description: msg });
    } finally {
      setUploadingFor(null);
    }
  };

  const handleDelete = async (doc: DocRow) => {
    if (!confirm(`Supprimer "${doc.file_name}" ?`)) return;
    await supabase.storage.from("animal-documents").remove([doc.storage_path]);
    const { error } = await supabase.from("animal_documents").delete().eq("id", doc.id);
    if (error) { toast.error("Erreur", { description: error.message }); return; }
    toast.success("Document supprimé");
    refresh();
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-title mb-1">Mes documents associés</h1>
      <p className="text-muted-foreground mb-6">Tous les documents de santé de vos animaux, regroupés par compagnon.</p>

      {loading ? (
        <div className="bg-card rounded-xl border border-brand-border p-12 text-center text-muted-foreground">Chargement…</div>
      ) : animals.length === 0 ? (
        <div className="bg-card rounded-xl border border-brand-border p-12 text-center">
          <PawPrint className="h-12 w-12 text-brand-accent mx-auto mb-4" />
          <p className="text-brand-title font-semibold">Aucun animal enregistré</p>
          <p className="text-muted-foreground text-sm mt-1">Ajoutez d'abord un animal pour pouvoir y associer des documents.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {animals.map((animal) => {
            const animalDocs = docs.filter((d) => d.animal_id === animal.id);
            return (
              <motion.section
                key={animal.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl border border-brand-border p-5 sm:p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-brand-soft flex items-center justify-center">
                      <PawPrint className="h-5 w-5 text-brand-accent" />
                    </div>
                    <div>
                      <p className="font-bold text-brand-title">{animal.name}</p>
                      <p className="text-xs text-muted-foreground">{animal.species} · {animalDocs.length} document{animalDocs.length > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <UploadButton
                      label="Carnet de santé"
                      icon={NotebookText}
                      busy={uploadingFor === animal.id}
                      onFile={(f) => handleUpload(animal.id, f, "health_book")}
                    />
                    <UploadButton
                      label="Autre document"
                      icon={Upload}
                      busy={uploadingFor === animal.id}
                      onFile={(f) => handleUpload(animal.id, f, "other")}
                    />
                  </div>
                </div>

                {animalDocs.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic px-1">Aucun document pour {animal.name}.</p>
                ) : (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {animalDocs.map((d) => {
                      const isHealth = d.category === "health_book";
                      const Icon = isHealth ? NotebookText : (d.mime_type?.startsWith("image/") ? FileImage : FileText);
                      return (
                        <li key={d.id} className="flex items-center gap-3 rounded-xl border border-brand-border bg-background p-3">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${isHealth ? "bg-emerald-50 text-emerald-700" : "bg-brand-soft text-brand-accent"}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-brand-title truncate">{d.file_name}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {isHealth ? "Carnet de santé" : "Document"} · {new Date(d.created_at).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                          <a href={d.public_url} target="_blank" rel="noopener noreferrer" title="Aperçu / téléchargement"
                             className="h-8 w-8 rounded-lg flex items-center justify-center text-brand-accent hover:bg-brand-soft">
                            <Download className="h-4 w-4" />
                          </a>
                          <button onClick={() => handleDelete(d)} title="Supprimer"
                                  className="h-8 w-8 rounded-lg flex items-center justify-center text-rose-600 hover:bg-rose-50">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </motion.section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function UploadButton({ label, icon: Icon, busy, onFile }: { label: string; icon: React.ComponentType<{ className?: string }>; busy: boolean; onFile: (f: File) => void }) {
  return (
    <label className={`inline-flex items-center gap-1.5 rounded-xl border border-brand-border bg-background px-3 py-2 text-xs font-medium text-brand-title cursor-pointer hover:border-brand-accent/60 transition-colors ${busy ? "opacity-50 pointer-events-none" : ""}`}>
      <Icon className="h-3.5 w-3.5 text-brand-accent" />
      {busy ? "Envoi…" : label}
      <input
        type="file"
        className="hidden"
        accept="image/*,application/pdf"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
    </label>
  );
}
