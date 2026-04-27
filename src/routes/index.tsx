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
import { TopNavbar, type AnyNavKey } from "@/components/veto/TopNavbar";
import { Footer } from "@/components/veto/Footer";
import { SosModal } from "@/components/veto/SosModal";
import { NotificationsPage } from "@/components/veto/NotificationsPage";
import { Phone } from "lucide-react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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

type View = "landing" | "auth" | "dashboard" | "search" | "news" | "notifications";

const PROTECTED_MESSAGE = "Veuillez vous inscrire ou vous connecter pour accéder à ce service";

function Index() {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const [history, setHistory] = useState<View[]>(["landing"]);
  const view = history[history.length - 1];
  const [sosOpen, setSosOpen] = useState(false);
  const [profileTrigger, setProfileTrigger] = useState(0);
  const [settingsTrigger, setSettingsTrigger] = useState(0);
  const [sectionTrigger, setSectionTrigger] = useState<{ key: string; n: number }>({ key: "", n: 0 });

  const navigate = (next: View) =>
    setHistory((h) => (h[h.length - 1] === next ? h : [...h, next]));
  const goBack = () => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));

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

  const goLogo = () => {
    // Goes to the appropriate "home" depending on role
    if (user && profile) {
      setHistory(["landing", "dashboard"]);
    } else {
      goLanding();
    }
  };

  const triggerSection = (key: string) => {
    setHistory(["landing", "dashboard"]);
    setSectionTrigger({ key, n: sectionTrigger.n + 1 });
  };

  const goProfile = () => {
    setHistory(["landing", "dashboard"]);
    setProfileTrigger((n) => n + 1);
  };
  const goSettings = () => {
    setHistory(["landing", "dashboard"]);
    setSettingsTrigger((n) => n + 1);
  };
  const goNotifications = () => navigate("notifications");

  const handleLogout = async () => {
    await signOut();
    goLanding();
    toast.success("Déconnecté");
  };

  const handleUserMenu = (k: "profile" | "settings" | "logout" | "notifications") => {
    if (k === "profile") goProfile();
    else if (k === "settings") goSettings();
    else if (k === "logout") handleLogout();
    else if (k === "notifications") goNotifications();
  };

  const scrollToSection = (id: string) => {
    if (view !== "landing") {
      goLanding();
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleGuestNav = (k: "home" | "how" | "services" | "partner") => {
    if (k === "home") {
      goLanding();
      window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
      return;
    }
    if (k === "how") scrollToSection("how-it-works");
    else if (k === "services") scrollToSection("services");
    else if (k === "partner") scrollToSection("partner");
  };

  const handleClientNav = (k: "dashboard" | "animals" | "booking" | "sos" | "adopt") => {
    if (k === "sos") { handleSos(); return; }
    if (k === "dashboard") { setHistory(["landing", "dashboard"]); setSectionTrigger({ key: "rdv", n: sectionTrigger.n + 1 }); return; }
    triggerSection(k === "booking" ? "booking" : k === "animals" ? "animals" : "adopt");
  };

  const handleVetoNav = (k: "calendar" | "patients" | "requests" | "emergency") => {
    if (k === "calendar") triggerSection("calendar");
    else if (k === "patients") triggerSection("patients");
    else if (k === "requests") triggerSection("queue");
    else if (k === "emergency") triggerSection("queue"); // urgent items live in queue
  };

  const handleFooterScroll = (key: "services" | "news" | "testimonials" | "home") => {
    if (key === "news") { goNews(); return; }
    if (key === "home") {
      goLanding();
      window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
      return;
    }
    scrollToSection(key);
  };

  const toggleVetAvailable = async () => {
    if (!profile) return;
    const next = !profile.emergency_24_7;
    await supabase.from("profiles").update({ emergency_24_7: next }).eq("id", profile.id);
    await refreshProfile();
    toast.success(next ? "Vous êtes maintenant disponible pour les urgences" : "Mode urgences désactivé");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-10 w-10 rounded-full border-2 border-brand-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  // Determine role + active nav key
  const role: "guest" | "client" | "veto" = !user || !profile
    ? "guest"
    : profile.role === "veto" ? "veto" : "client";

  const showSos = role === "client";

  let active: AnyNavKey | undefined;
  if (role === "guest") active = view === "landing" ? "home" : undefined;

  // Vet dashboard takes over the full screen
  if (user && profile?.role === "veto" && view !== "search" && view !== "news" && view !== "auth" && view !== "notifications") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <TopNavbar
          role="veto"
          onLogo={goLogo}
          onVetoNav={handleVetoNav}
          onUserMenu={handleUserMenu}
          onSeeAllNotifications={goNotifications}
          userName={profile?.full_name}
          userEmail={profile?.email}
          vetAvailable={!!profile?.emergency_24_7}
          onToggleVetAvailable={toggleVetAvailable}
        />
        <div className="flex-1">
          <VetoDashboard profileTrigger={profileTrigger} settingsTrigger={settingsTrigger} sectionTrigger={sectionTrigger} />
        </div>
        <Footer
          onNavigate={(k) => navigate(k === "search" ? "search" : k === "news" ? "news" : "landing")}
          onScrollTo={handleFooterScroll}
        />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavbar
        role={role}
        onLogo={goLogo}
        onGuestNav={role === "guest" ? handleGuestNav : undefined}
        onClientNav={role === "client" ? handleClientNav : undefined}
        onUserMenu={handleUserMenu}
        onAuth={goAuth}
        onRegister={goAuth}
        onSeeAllNotifications={goNotifications}
        active={active}
        userName={profile?.full_name}
        userEmail={profile?.email}
      />

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.main
            key={view}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {view === "landing" && (
              <Landing
                onStart={goAuth}
                onSeeServices={() => scrollToSection("services")}
                onSeeNews={goNews}
              />
            )}
            {view === "auth" && (
              <AuthScreen onBack={goBack} onSuccess={() => navigate("dashboard")} />
            )}
            {view === "dashboard" && user && profile && (
              <ClientDashboard
                onFindClinic={handleFindClinic}
                profileTrigger={profileTrigger}
                settingsTrigger={settingsTrigger}
                sectionTrigger={sectionTrigger}
              />
            )}
            {view === "search" && <ClinicSearch />}
            {view === "news" && <NewsView />}
            {view === "notifications" && <NotificationsPage onBack={goBack} />}
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
