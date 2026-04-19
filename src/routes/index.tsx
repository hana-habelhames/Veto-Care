import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { Landing } from "@/components/veto/Landing";
import { RoleSelect } from "@/components/veto/RoleSelect";
import { ClientOnboarding } from "@/components/veto/ClientOnboarding";
import { VetoOnboarding } from "@/components/veto/VetoOnboarding";
import { ClientDashboard } from "@/components/veto/ClientDashboard";
import { PawPrint, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ClientProfile } from "@/components/veto/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Veto-Care — Plateforme vétérinaire moderne" },
      { name: "description", content: "Veto-Care connecte propriétaires et vétérinaires pour un suivi de santé animal simple et bienveillant." },
      { property: "og:title", content: "Veto-Care — Plateforme vétérinaire moderne" },
      { property: "og:description", content: "Suivi santé, rendez-vous et téléconsultation pour vos animaux." },
    ],
  }),
  component: Index,
});

type View = "landing" | "role" | "client" | "veto" | "dashboard" | "done";

function Index() {
  const [view, setView] = useState<View>("landing");
  const [profile, setProfile] = useState<ClientProfile | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {view !== "dashboard" && (
        <header className="px-6 py-5 border-b border-border/40">
          <div className="mx-auto max-w-6xl flex items-center justify-between">
            <button onClick={() => setView("landing")} className="flex items-center gap-2 text-brand-title font-bold text-xl">
              <span className="h-9 w-9 rounded-xl bg-brand-accent flex items-center justify-center">
                <PawPrint className="h-5 w-5 text-brand-accent-foreground" />
              </span>
              Veto-Care
            </button>
            {view === "landing" && (
              <Button onClick={() => setView("role")} className="bg-brand-title text-primary-foreground hover:bg-brand-title/90 rounded-xl">
                S'inscrire
              </Button>
            )}
          </div>
        </header>
      )}

      {view === "dashboard" && (
        <header className="px-6 py-4 border-b border-border/40 bg-card">
          <div className="mx-auto max-w-5xl flex items-center justify-between">
            <button onClick={() => setView("landing")} className="flex items-center gap-2 text-brand-title font-bold text-lg">
              <span className="h-8 w-8 rounded-xl bg-brand-accent flex items-center justify-center">
                <PawPrint className="h-4 w-4 text-brand-accent-foreground" />
              </span>
              Veto-Care
            </button>
            <Button variant="ghost" onClick={() => setView("landing")} className="text-sm text-muted-foreground hover:text-brand-title">
              Déconnexion
            </Button>
          </div>
        </header>
      )}

      <AnimatePresence mode="wait">
        <motion.main
          key={view}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {view === "landing" && <Landing onStart={() => setView("role")} />}
          {view === "role" && <RoleSelect onSelect={(r) => setView(r)} onBack={() => setView("landing")} />}
          {view === "client" && (
            <ClientOnboarding
              onBack={() => setView("role")}
              onDone={(p) => { setProfile(p); setView("dashboard"); }}
            />
          )}
          {view === "veto" && <VetoOnboarding onBack={() => setView("role")} onDone={() => setView("done")} />}
          {view === "dashboard" && profile && <ClientDashboard profile={profile} />}
          {view === "done" && (
            <div className="min-h-[60vh] flex items-center justify-center px-6">
              <div className="text-center max-w-md">
                <div className="h-16 w-16 rounded-full bg-brand-soft mx-auto mb-5 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-brand-accent" />
                </div>
                <h1 className="text-3xl font-bold text-brand-title mb-3">Bienvenue dans Veto-Care !</h1>
                <p className="text-muted-foreground mb-8">Votre profil a bien été créé.</p>
                <Button onClick={() => setView("landing")} className="bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 rounded-xl">
                  Retour à l'accueil
                </Button>
              </div>
            </div>
          )}
        </motion.main>
      </AnimatePresence>

      <Toaster />
    </div>
  );
}
