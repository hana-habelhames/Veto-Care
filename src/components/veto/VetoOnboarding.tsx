import { useState } from "react";
import { motion } from "framer-motion";
import { Stethoscope, Home, Siren } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function VetoOnboarding({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [clinicName, setClinicName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [homeVisit, setHomeVisit] = useState(false);
  const [emergency24, setEmergency24] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profil clinique créé !");
    onDone();
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-12">
      <form onSubmit={submit} className="mx-auto max-w-2xl">
        <button type="button" onClick={onBack} className="text-sm text-muted-foreground hover:text-brand-title mb-6">← Retour</button>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-title mb-2">Profil clinique</h1>
          <p className="text-muted-foreground mb-10">Renseignez les informations de votre clinique.</p>
        </motion.div>

        <div className="bg-card rounded-xl p-6 md:p-8 border border-brand-border space-y-5 mb-6">
          <h2 className="font-semibold text-brand-title text-lg flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-brand-accent" /> Identité de la clinique
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Nom de la clinique" value={clinicName} onChange={setClinicName} required />
            <Field label="Email professionnel" type="email" value={email} onChange={setEmail} required />
            <Field label="Téléphone" value={phone} onChange={setPhone} required />
            <Field label="Adresse" value={address} onChange={setAddress} required />
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 md:p-8 border border-brand-border space-y-4 mb-6">
          <h2 className="font-semibold text-brand-title text-lg">Services proposés</h2>
          <ToggleRow
            icon={<Home className="h-5 w-5" />}
            title="Visite à domicile"
            description="Vous vous déplacez chez les propriétaires."
            checked={homeVisit}
            onChange={setHomeVisit}
          />
          <ToggleRow
            icon={<Siren className="h-5 w-5" />}
            title="Urgence 24/7"
            description="Disponible pour les urgences en dehors des heures d'ouverture."
            checked={emergency24}
            onChange={setEmergency24}
          />
        </div>

        <Button type="submit" size="lg" className="w-full mt-2 bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 rounded-xl h-12 text-base">
          Finaliser mon profil
        </Button>
      </form>
    </div>
  );
}

function ToggleRow({
  icon, title, description, checked, onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-full flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-colors ${
        checked ? "border-brand-accent bg-brand-soft" : "border-brand-border bg-card hover:border-brand-accent/50"
      }`}
    >
      <span className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
        checked ? "bg-brand-accent text-brand-accent-foreground" : "bg-brand-soft text-brand-accent"
      }`}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-brand-title">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {/* Switch */}
      <span
        className={`relative h-7 w-12 rounded-full transition-colors shrink-0 ${
          checked ? "bg-brand-accent" : "bg-brand-border"
        }`}
        aria-hidden
      >
        <motion.span
          className="absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      </span>
    </button>
  );
}

function Field({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-brand-title text-sm">{label}{required && " *"}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className="rounded-xl" />
    </div>
  );
}
