import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { Landing } from "@/components/veto/Landing";
import { RoleSelect } from "@/components/veto/RoleSelect";
import { ClientOnboarding } from "@/components/veto/ClientOnboarding";
import { VetoOnboarding } from "@/components/veto/VetoOnboarding";
import { ClientDashboard } from "@/components/veto/ClientDashboard";
import { VetoDashboard } from "@/components/veto/VetoDashboard";
import { ClinicSearch } from "@/components/veto/ClinicSearch";
import { TopNavbar } from "@/components/veto/TopNavbar";
import { SosModal } from "@/components/veto/SosModal";
import { CheckCircle2, Phone } from "lucide-react";
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

type View = "landing" | "role" | "client" | "veto" | "dashboard" | "vet-dashboard" | "search" | "done";

function Index() {
  const [view, setView] = useState<View>("landing");
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [sosOpen, setSosOpen] = useState(false);

  const isOnboardingFlow = view === "role" || view === "client" || view === "veto" || view === "done";
  const showNavbar = !isOnboardingFlow && view !== "vet-dashboard";

  const goLanding = () => setView("landing");
  const goSearch = () => setView("search");
  const goProfile = () => {
    if (profile) setView("dashboard");
    else setView("role");
  };

  return (
    <div className="min-h-screen bg-background">
      {showNavbar && (
        <TopNavbar
          onLogo={goLanding}
          onSearch={goSearch}
          onProfile={profile ? goProfile : undefined}
          showAuth={!profile && view === "landing"}
          onAuth={() => setView("role")}
        />
      )}

      {view === "vet-dashboard" && (
        <header className="px-6 py-4 border-b border-brand-border/70 bg-card">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <button onClick={goLanding} className="flex items-center gap-2 text-brand-title font-bold text-lg">
              Veto-Care <span className="text-brand-accent text-xs font-semibold ml-1">PRO</span>
            </button>
            <Button variant="ghost" onClick={goLanding} className="text-sm text-muted-foreground hover:text-brand-title">
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
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {view === "landing" && <Landing onStart={() => setView("role")} />}
          {view === "role" && <RoleSelect onSelect={(r) => setView(r)} onBack={() => setView("landing")} />}
          {view === "client" && (
            <ClientOnboarding
              onBack={() => setView("role")}
              onDone={(p) => { setProfile(p); setView("dashboard"); }}
            />
          )}
          {view === "veto" && <VetoOnboarding onBack={() => setView("role")} onDone={() => setView("vet-dashboard")} />}
          {view === "dashboard" && profile && (
            <ClientDashboard
              profile={profile}
              setProfile={setProfile}
              onLogout={() => { setProfile(null); setView("landing"); }}
              onFindClinic={goSearch}
            />
          )}
          {view === "vet-dashboard" && <VetoDashboard />}
          {view === "search" && <ClinicSearch />}
          {view === "done" && (
            <div className="min-h-[60vh] flex items-center justify-center px-6">
              <div className="text-center max-w-md">
                <div className="h-16 w-16 rounded-full bg-brand-soft mx-auto mb-5 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-brand-accent" />
                </div>
                <h1 className="text-3xl font-bold text-brand-title mb-3">Bienvenue dans Veto-Care !</h1>
                <p className="text-muted-foreground mb-8">Votre profil a bien été créé.</p>
                <Button onClick={goLanding} className="bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 rounded-xl">
                  Retour à l'accueil
                </Button>
              </div>
            </div>
          )}
        </motion.main>
      </AnimatePresence>

      {/* Global SOS FAB (visible everywhere except onboarding flow) */}
      {!isOnboardingFlow && (
        <motion.button
          onClick={() => setSosOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-40 h-16 w-16 rounded-full bg-brand-sos text-brand-sos-foreground shadow-lg flex flex-col items-center justify-center gap-0.5"
          style={{ boxShadow: "0 10px 30px -8px oklch(0.7 0.085 20 / 0.6)" }}
          aria-label="Urgences SOS"
        >
          <Phone className="h-5 w-5" />
          <span className="text-[10px] font-bold tracking-wider">SOS</span>
        </motion.button>
      )}

      <SosModal open={sosOpen} onClose={() => setSosOpen(false)} />
      <Toaster />
    </div>
  );
}
