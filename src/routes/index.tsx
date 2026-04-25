import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Landing } from "@/components/veto/Landing";
import { AuthScreen } from "@/components/veto/AuthScreen";
import { ClientDashboard } from "@/components/veto/ClientDashboard";
import { VetoDashboard } from "@/components/veto/VetoDashboard";
import { ClinicSearch } from "@/components/veto/ClinicSearch";
import { NewsView } from "@/components/veto/NewsView";
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

type View = "landing" | "auth" | "dashboard" | "search" | "news";

const PROTECTED_MESSAGE = "Veuillez vous inscrire ou vous connecter pour accéder à ce service";

function Index() {
  const { user, profile, loading } = useAuth();
  const [history, setHistory] = useState<View[]>(["landing"]);
  const view = history[history.length - 1];
  const [sosOpen, setSosOpen] = useState(false);
  const [profileTrigger, setProfileTrigger] = useState(0);

  const navigate = (next: View) =>
    setHistory((h) => (h[h.length - 1] === next ? h : [...h, next]));
  const goBack = () => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));

  const goProfile = () => {
    // Switch back to dashboard view (if on search/news) and signal profile section
    setHistory(["landing", "dashboard"]);
    setProfileTrigger((n) => n + 1);
  };

  const effectiveView: View =
    user && profile && view !== "search" && view !== "news" ? "dashboard" : view;

  const goLanding = () => setHistory(["landing"]);
  const goAuth = () => navigate("auth");
  const goNews = () => navigate("news");

  const requireAuth = (next: () => void) => {
    if (!user) {
      toast.error(PROTECTED_MESSAGE);
      navigate("auth");
      return;
    }
    next();
  };

  const handleFindClinic = () => requireAuth(() => navigate("search"));
  const handleSos = () => requireAuth(() => setSosOpen(true));

  const scrollToSection = (id: string) => {
    if (effectiveView !== "landing") {
      goLanding();
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNav = (key: "home" | "services" | "news") => {
    if (key === "news") {
      goNews();
      return;
    }
    if (key === "home") {
      goLanding();
      window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
      return;
    }
    scrollToSection("services");
  };

  const handleFooterScroll = (key: "services" | "news" | "testimonials" | "home") => {
    if (key === "news") {
      goNews();
      return;
    }
    if (key === "home") {
      goLanding();
      window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
      return;
    }
    scrollToSection(key);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-10 w-10 rounded-full border-2 border-brand-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  // SOS visible only when client connected
  const showSos = !!user && profile?.role === "client";

  // Vet dashboard takes over the full screen
  if (user && profile?.role === "veto" && view !== "search" && view !== "news") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <TopNavbar
          onLogo={goLanding}
          onNav={handleNav}
          onProfile={goProfile}
          userName={profile?.full_name}
          userEmail={profile?.email}
        />
        <div className="flex-1">
          <VetoDashboard profileTrigger={profileTrigger} />
        </div>
        <Footer
          onNavigate={(k) => navigate(k === "search" ? "search" : k === "news" ? "news" : "landing")}
          onScrollTo={handleFooterScroll}
        />
        <Toaster />
      </div>
    );
  }

  const navActive: "home" | "services" | "news" | undefined =
    effectiveView === "news" ? "news" : effectiveView === "landing" ? "home" : undefined;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavbar
        onLogo={goLanding}
        onNav={handleNav}
        onProfile={user ? goProfile : undefined}
        showAuth={!user}
        onAuth={goAuth}
        active={navActive}
        userName={profile?.full_name}
        userEmail={profile?.email}
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
            {effectiveView === "landing" && (
              <Landing
                onStart={goAuth}
                onSeeServices={() => scrollToSection("services")}
                onSeeNews={goNews}
              />
            )}
            {effectiveView === "auth" && (
              <AuthScreen onBack={goBack} onSuccess={() => navigate("dashboard")} />
            )}
            {effectiveView === "dashboard" && user && profile && (
              <ClientDashboard onFindClinic={handleFindClinic} profileTrigger={profileTrigger} />
            )}
            {effectiveView === "search" && <ClinicSearch />}
            {effectiveView === "news" && <NewsView />}
          </motion.main>
        </AnimatePresence>
      </div>

      <Footer
        onNavigate={(k) => navigate(k === "search" ? "search" : k === "news" ? "news" : "landing")}
        onScrollTo={handleFooterScroll}
      />

      {showSos && (
        <motion.button
          onClick={handleSos}
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
