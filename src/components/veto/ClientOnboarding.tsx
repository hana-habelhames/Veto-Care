import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Animal, ClientProfile } from "./data";

export function ClientOnboarding({ onBack, onDone }: { onBack: () => void; onDone: (profile: ClientProfile) => void }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [animals, setAnimals] = useState<Animal[]>([
    { id: crypto.randomUUID(), name: "", species: "", age: "" },
  ]);

  const addAnimal = () =>
    setAnimals((a) => [...a, { id: crypto.randomUUID(), name: "", species: "", age: "" }]);
  const removeAnimal = (id: string) => setAnimals((a) => a.filter((x) => x.id !== id));
  const updateAnimal = (id: string, field: keyof Animal, val: string) =>
    setAnimals((a) => a.map((x) => (x.id === id ? { ...x, [field]: val } : x)));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profil créé !", { description: `${animals.length} animal(aux) enregistré(s).` });
    onDone({ fullName, email, phone, city, animals });
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <form onSubmit={submit} className="mx-auto max-w-2xl">
        <button type="button" onClick={onBack} className="text-sm text-muted-foreground hover:text-brand-title mb-6">← Retour</button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-brand-title mb-2">Créer votre profil</h1>
          <p className="text-muted-foreground mb-10">Quelques infos pour personnaliser votre expérience.</p>
        </motion.div>

        <div className="bg-card rounded-xl p-6 md:p-8 border border-border/50 shadow-sm space-y-5 mb-6">
          <h2 className="font-semibold text-brand-title text-lg">Vos informations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Nom complet" value={fullName} onChange={setFullName} required />
            <Field label="Email" type="email" value={email} onChange={setEmail} required />
            <Field label="Téléphone" value={phone} onChange={setPhone} />
            <Field label="Ville" value={city} onChange={setCity} />
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 md:p-8 border border-border/50 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-brand-title text-lg flex items-center gap-2">
              <PawPrint className="h-5 w-5 text-brand-accent" /> Vos animaux
            </h2>
            <span className="text-sm text-muted-foreground">{animals.length}</span>
          </div>

          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {animals.map((a, idx) => (
                <motion.div
                  key={a.id}
                  layout
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-brand-title">Animal #{idx + 1}</span>
                    {animals.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAnimal(a.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input placeholder="Nom" value={a.name} onChange={(e) => updateAnimal(a.id, "name", e.target.value)} className="rounded-lg" />
                    <Input placeholder="Espèce (chien, chat...)" value={a.species} onChange={(e) => updateAnimal(a.id, "species", e.target.value)} className="rounded-lg" />
                    <Input placeholder="Âge" value={a.age} onChange={(e) => updateAnimal(a.id, "age", e.target.value)} className="rounded-lg" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={addAnimal}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-accent/40 text-brand-accent py-3 font-medium hover:bg-brand-soft transition-colors"
          >
            <Plus className="h-4 w-4" /> Ajouter un animal
          </button>
        </div>

        <Button type="submit" size="lg" className="w-full mt-8 bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 rounded-xl h-12 text-base">
          Finaliser mon inscription
        </Button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-brand-title text-sm">{label}{required && " *"}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className="rounded-lg" />
    </div>
  );
}
