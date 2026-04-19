import { useState } from "react";
import { motion } from "framer-motion";
import { Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const SPECIALTIES = ["Chirurgie", "Dentaire", "Dermatologie", "Cardiologie", "NAC", "Comportement"];
const SERVICES = ["Téléconsultation", "Visite à domicile", "Urgences", "Vaccination", "Stérilisation"];

export function VetoOnboarding({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [clinic, setClinic] = useState("");
  const [license, setLicense] = useState("");
  const [bio, setBio] = useState("");
  const [specialties, setSpecialties] = useState<Set<string>>(new Set());
  const [services, setServices] = useState<Set<string>>(new Set());

  const toggle = (set: Set<string>, setter: (s: Set<string>) => void, key: string) => {
    const next = new Set(set);
    next.has(key) ? next.delete(key) : next.add(key);
    setter(next);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profil vétérinaire créé !");
    onDone();
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <form onSubmit={submit} className="mx-auto max-w-2xl">
        <button type="button" onClick={onBack} className="text-sm text-muted-foreground hover:text-brand-title mb-6">← Retour</button>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-brand-title mb-2">Profil vétérinaire</h1>
          <p className="text-muted-foreground mb-10">Renseignez vos informations professionnelles.</p>
        </motion.div>

        <div className="bg-card rounded-xl p-6 md:p-8 border border-border/50 shadow-sm space-y-5 mb-6">
          <h2 className="font-semibold text-brand-title text-lg flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-brand-accent" /> Identité professionnelle
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Nom complet" value={fullName} onChange={setFullName} required />
            <Field label="Email pro" type="email" value={email} onChange={setEmail} required />
            <Field label="Clinique" value={clinic} onChange={setClinic} />
            <Field label="N° d'ordre" value={license} onChange={setLicense} required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-brand-title text-sm">Présentation</Label>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="rounded-lg resize-none" placeholder="Parlez de votre approche..." />
          </div>
        </div>

        <ToggleGroup title="Spécialités" items={SPECIALTIES} selected={specialties} onToggle={(k) => toggle(specialties, setSpecialties, k)} />
        <ToggleGroup title="Services proposés" items={SERVICES} selected={services} onToggle={(k) => toggle(services, setServices, k)} />

        <Button type="submit" size="lg" className="w-full mt-8 bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 rounded-xl h-12 text-base">
          Finaliser mon profil
        </Button>
      </form>
    </div>
  );
}

function ToggleGroup({ title, items, selected, onToggle }: { title: string; items: string[]; selected: Set<string>; onToggle: (k: string) => void }) {
  return (
    <div className="bg-card rounded-xl p-6 md:p-8 border border-border/50 shadow-sm mb-6">
      <h2 className="font-semibold text-brand-title text-lg mb-5">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const active = selected.has(item);
          return (
            <motion.button
              key={item}
              type="button"
              onClick={() => onToggle(item)}
              whileTap={{ scale: 0.95 }}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium border-2 transition-all ${
                active
                  ? "bg-brand-accent text-brand-accent-foreground border-brand-accent shadow-sm"
                  : "bg-background text-brand-title border-border hover:border-brand-accent/50"
              }`}
            >
              {item}
            </motion.button>
          );
        })}
      </div>
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
