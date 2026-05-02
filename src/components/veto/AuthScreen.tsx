import { useState } from "react";
import { motion } from "framer-motion";
import { PawPrint, Stethoscope, Mail, Lock, User as UserIcon, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";
import { lovable } from "@/integrations/lovable";

type Mode = "login" | "signup";
type Role = "client" | "veto";

export function AuthScreen({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
 const navigate = useNavigate();
 
  const [mode, setMode] = useState<Mode>("signup");
  const [role, setRole] = useState<Role>("client");
  const [loading, setLoading] = useState(false);

  // Common
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  // Vet only
  const [clinicName, setClinicName] = useState("");
  const [emergency, setEmergency] = useState(false);
  const [homeVisit, setHomeVisit] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        toast.success("Connecté !");
        
        if (profile?.role === "veto") {
          navigate({ to: "/veto" });
        } else {
          navigate({ to: "/client" });
        }

      } else {
        // MODE INSCRIPTION
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, role },
          },
        });
        if (error) throw error;

        if (data.user) {
          // 1. Mise à jour du profil de base
          await supabase.from("profiles").update({
            full_name: fullName,
            role: role,
          }).eq("id", data.user.id);

          // 2. Insertion dans les nouvelles tables (Ici, on est bien À L'INTÉRIEUR du if(data.user) )
          // On ajoute "as any" pour faire disparaître les lignes rouges de TypeScript
          if (role === "veto") {
            await supabase.from("veterinaires" as any).insert({
              id: data.user.id,
              clinic_name: clinicName,
              phone: phone,
              address: address,
              city: city,
              emergency_24_7: emergency,
              home_visit: homeVisit
            });
          } else {
            await supabase.from("clients" as any).insert({
              id: data.user.id,
              phone: phone,
              address: address,
              city: city
            });
          }
        } 

        // Ces lignes sont maintenant bien placées, elles ne s'exécuteront que pour l'inscription
        toast.success("Inscription réussie !", { description: "Bienvenue sur Veto-Care 🎉" });
        
        if (role === "veto") {
          navigate({ to: "/veto" });
        } else {
          navigate({ to: "/client" });
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error("Erreur", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 flex items-start justify-center">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
        <button onClick={onBack} className="text-sm text-muted-foreground hover:text-brand-title mb-6">← Retour</button>

        <div className="bg-card rounded-xl border border-brand-border p-6 md:p-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-brand-soft/50 p-1 rounded-xl">
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${mode === "signup" ? "bg-card text-brand-title shadow-sm" : "text-muted-foreground"}`}
            >
              Inscription
            </button>
            <button
              onClick={() => setMode("login")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${mode === "login" ? "bg-card text-brand-title shadow-sm" : "text-muted-foreground"}`}
            >
              Connexion
            </button>
          </div>

          <h1 className="text-2xl font-bold text-brand-title mb-1">
            {mode === "login" ? "Bon retour !" : "Créer un compte"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === "login" ? "Connectez-vous à votre espace Veto-Care." : "Rejoignez la plateforme vétérinaire en Algérie."}
          </p>

          <form onSubmit={handleAuth} className="space-y-4">
            {mode === "signup" && (
              <>
                {/* Role */}
                <div>
                  <Label className="text-brand-title text-sm mb-2 block">Je suis...</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { v: "client", l: "Propriétaire", icon: PawPrint },
                      { v: "veto", l: "Vétérinaire", icon: Stethoscope },
                    ] as const).map((r) => (
                      <button
                        key={r.v}
                        type="button"
                        onClick={() => setRole(r.v)}
                        className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-medium transition-all ${role === r.v ? "border-brand-accent bg-brand-soft text-brand-title" : "border-brand-border bg-card text-brand-title hover:border-brand-accent/50"}`}
                      >
                        <r.icon className="h-4 w-4" /> {r.l}
                      </button>
                    ))}
                  </div>
                </div>

                <FieldIcon icon={UserIcon} label="Nom complet" value={fullName} onChange={setFullName} required />
                {role === "veto" && (
                  <FieldIcon icon={Stethoscope} label="Nom de la clinique" value={clinicName} onChange={setClinicName} required />
                )}
              </>
            )}

            <FieldIcon icon={Mail} type="email" label="Email" value={email} onChange={setEmail} required />
            <FieldIcon icon={Lock} type="password" label="Mot de passe" value={password} onChange={setPassword} required minLength={6} />

            {mode === "signup" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FieldIcon icon={Phone} label="Téléphone" value={phone} onChange={setPhone} placeholder="+213 ..." />
                  <FieldIcon icon={MapPin} label="Ville" value={city} onChange={setCity} placeholder="Alger, Oran..." />
                </div>
                <FieldIcon icon={MapPin} label="Adresse complète" value={address} onChange={setAddress} />

                {role === "veto" && (
                  <div className="space-y-2 pt-2">
                    <ToggleRow label="Visite à domicile" value={homeVisit} onChange={setHomeVisit} />
                    <ToggleRow label="Urgences 24/7" value={emergency} onChange={setEmergency} />
                  </div>
                )}
              </>
            )}

            <Button type="submit" disabled={loading} size="lg" className="w-full bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 rounded-xl h-12">
              {loading ? "..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function FieldIcon({ icon: Icon, label, value, onChange, type = "text", required, placeholder, minLength }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string; minLength?: number }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-brand-title text-sm">{label}{required && " *"}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder} minLength={minLength} className="rounded-xl pl-9" />
      </div>
    </div>
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)} className="w-full flex items-center justify-between rounded-xl border border-brand-border bg-background px-4 py-3 hover:bg-brand-soft/40 transition-colors">
      <span className="text-sm font-medium text-brand-title">{label}</span>
      <span className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? "bg-brand-accent" : "bg-brand-border"}`}>
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`} />
      </span>
    </button>
  );
}
