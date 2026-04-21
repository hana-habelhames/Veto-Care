import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { Landing } from "@/components/veto/Landing";
import { AuthScreen } from "@/components/veto/AuthScreen";
import { ClientDashboard } from "@/components/veto/ClientDashboard";
import { VetoDashboard } from "@/components/veto/VetoDashboard";
import { ClinicSearch } from "@/components/veto/ClinicSearch";
import { TopNavbar } from "@/components/veto/TopNavbar";
import { Footer } from "@/components/veto/Footer";
import { SosModal } from "@/components/veto/SosModal";
import { Phone } from "lucide-react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Veto-Care — Plateforme vétérinaire en Algérie" },
      { name: "description", content: "Veto-Care connecte propriétaires et vétérinaires en Algérie pour un suivi de santé animal simple et bienveillant." },
      { property: "og:title", content: "Veto-Care — Plateforme vétérinaire en Algérie" },
      { property: "og:description", content: "Suivi santé, rendez-vous et téléconsultation pour vos animaux." },
    ],
  }),
  component: () => (
    <AuthProvider>
      <Index />
    </AuthProvider>
  ),
});

type View = "landing" | "auth" | "dashboard" | "search";

function Index() {
  const { user, profile, loading } = useAuth();
  const [view, setView] = useState<View>("landing");
  const [sosOpen, setSosOpen] = useState(false);

  // Auto-redirect to dashboard once profile is loaded after login
  const effectiveView: View = user && profile && view !== "search" ? "dashboard" : view;

  const goLanding = () => setView("landing");
  const goSearch = () => setView("search");
  const goAuth = () => setView("auth");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-10 w-10 rounded-full border-2 border-brand-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  // Vet dashboard takes over the full screen
  if (user && profile?.role === "veto" && view !== "search") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <TopNavbar onLogo={goLanding} onSearch={goSearch} onProfile={() => {}} />
        <div className="flex-1"><VetoDashboard /></div>
        <Footer onNavigate={(k) => setView(k === "search" ? "search" : "landing")} />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavbar
        onLogo={goLanding}
        onSearch={goSearch}
        onProfile={user ? () => setView("dashboard") : undefined}
        showAuth={!user}
        onAuth={goAuth}
      />

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.main
            key={effectiveView}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {effectiveView === "landing" && <Landing onStart={goAuth} />}
            {effectiveView === "auth" && <AuthScreen onBack={goLanding} onSuccess={() => setView("dashboard")} />}
            {effectiveView === "dashboard" && user && profile && <ClientDashboard onFindClinic={goSearch} />}
            {effectiveView === "search" && <ClinicSearch />}
          </motion.main>
        </AnimatePresence>
      </div>

      <Footer onNavigate={(k) => setView(k === "search" ? "search" : "landing")} />

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

      <SosModal open={sosOpen} onClose={() => setSosOpen(false)} />
      <Toaster />
    </div>
  );
}
