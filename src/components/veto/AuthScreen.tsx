import { useState } from "react";
import { motion } from "framer-motion";
import { PawPrint, Stethoscope, Mail, Lock, User as UserIcon, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

type Mode = "login" | "signup";
type Role = "client" | "veto";

export function AuthScreen({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
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
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Connecté !");
        onSuccess();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: fullName, role },
          },
        });
        if (error) throw error;

        // Update profile with extra fields
        if (data.user) {
          await supabase.from("profiles").update({
            full_name: fullName,
            phone,
            city,
            address,
            role,
            ...(role === "veto" && { clinic_name: clinicName, emergency_24_7: emergency, home_visit: homeVisit }),
          }).eq("id", data.user.id);
        }

        toast.success("Inscription réussie !", { description: "Bienvenue sur Veto-Care 🎉" });
        onSuccess();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error("Erreur", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  // Dans AuthScreen.tsx
const handleGoogle = async () => {
  setLoading(true);
  try {
    // 1. On garde le rôle en mémoire pour la première connexion
    localStorage.setItem("userRole", role);

    // 2. On définit l'adresse de destination
    const destination = role === "veto" ? "/veto" : "/client";

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // 3. Google redirigera DIRECTEMENT sur la bonne URL
        redirectTo: `${window.location.origin}${destination}`,
      },
    });

    if (error) throw error;
  } catch (err) {
    toast.error("Erreur Google");
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

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full mb-5 flex items-center justify-center gap-2.5 rounded-xl border border-brand-border bg-card hover:bg-brand-soft transition-colors py-3 text-sm font-medium text-brand-title"
          >
            <svg className="h-5 w-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.3-.1-2.7-.4-3.5z"/></svg>
            Continuer avec Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-brand-border" />
            <span className="text-xs text-muted-foreground">ou par email</span>
            <div className="flex-1 h-px bg-brand-border" />
          </div>

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
