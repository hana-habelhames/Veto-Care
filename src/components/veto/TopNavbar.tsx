import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PawPrint, LogIn, UserPlus, User, Settings, LogOut,
  LayoutDashboard, Calendar, CalendarPlus, Heart, Stethoscope,
  AlertTriangle, Briefcase, Users, ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationsBell } from "./NotificationsBell";

export type NavRole = "guest" | "client" | "veto";

export type GuestNavKey = "home" | "services" | "emergency";
export type ClientNavKey = "dashboard" | "animals" | "booking" | "sos" | "adopt";
export type VetoNavKey = "calendar" | "patients" | "requests" | "emergency";
export type AnyNavKey = GuestNavKey | ClientNavKey | VetoNavKey;

export type UserMenuKey = "profile" | "settings" | "logout" | "notifications";

function getInitials(name?: string | null, email?: string | null) {
  const source = (name || email || "?").trim();
  if (!source) return "?";
  const parts = source.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

type Item<K extends string> = { key: K; label: string; icon?: React.ComponentType<{ className?: string }>; tone?: "default" | "danger" };

const GUEST_ITEMS: Item<GuestNavKey>[] = [
  { key: "home", label: "Accueil" },
  { key: "services", label: "Nos Services" },
  { key: "emergency", label: "Urgences", icon: AlertTriangle, tone: "danger" },
];

const CLIENT_ITEMS: Item<ClientNavKey>[] = [
  { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { key: "animals", label: "Mes Animaux", icon: PawPrint },
  { key: "booking", label: "Prendre RDV", icon: CalendarPlus },
  { key: "sos", label: "Urgences 24/7", icon: AlertTriangle, tone: "danger" },
  { key: "adopt", label: "Adoptions", icon: Heart },
];

const VETO_ITEMS: Item<VetoNavKey>[] = [
  { key: "calendar", label: "Mon Planning", icon: Calendar },
  { key: "patients", label: "Mes Patients", icon: Users },
  { key: "requests", label: "Demandes de RDV", icon: ListChecks },
  { key: "emergency", label: "Urgences", icon: AlertTriangle, tone: "danger" },
];

export function TopNavbar({
  role,
  onLogo,
  onGuestNav,
  onClientNav,
  onVetoNav,
  active,
  onUserMenu,
  onAuth,
  onRegister,
  onSeeAllNotifications,
  userName,
  userEmail,
  vetAvailable,
  onToggleVetAvailable,
}: {
  role: NavRole;
  onLogo: () => void;
  onGuestNav?: (k: GuestNavKey) => void;
  onClientNav?: (k: ClientNavKey) => void;
  onVetoNav?: (k: VetoNavKey) => void;
  active?: AnyNavKey;
  onUserMenu?: (k: UserMenuKey) => void;
  onAuth?: () => void;
  onRegister?: () => void;
  onSeeAllNotifications?: () => void;
  userName?: string | null;
  userEmail?: string | null;
  vetAvailable?: boolean;
  onToggleVetAvailable?: () => void;
}) {
  const initials = getInitials(userName, userEmail);

  return (
    <header className="sticky top-0 z-30 bg-slate-800 text-slate-100 border-b border-slate-700/60 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button onClick={onLogo} className="flex items-center gap-2 font-bold text-lg shrink-0 text-white" aria-label="Accueil Veto-Care">
          <span className="h-9 w-9 rounded-xl bg-brand-accent flex items-center justify-center">
            <PawPrint className="h-5 w-5 text-white" />
          </span>
          <span className="hidden sm:inline">Veto-Care</span>
        </button>

        {/* Center nav */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {role === "guest" &&
            GUEST_ITEMS.map((it) => (
              <NavButton key={it.key} item={it} active={active === it.key} onClick={() => onGuestNav?.(it.key)} />
            ))}
          {role === "client" &&
            CLIENT_ITEMS.map((it) => (
              <NavButton key={it.key} item={it} active={active === it.key} onClick={() => onClientNav?.(it.key)} />
            ))}
          {role === "veto" &&
            VETO_ITEMS.map((it) => (
              <NavButton key={it.key} item={it} active={active === it.key} onClick={() => onVetoNav?.(it.key)} />
            ))}
        </nav>

        {/* Right zone */}
        <div className="flex items-center gap-2 shrink-0">
          {role === "veto" && typeof vetAvailable === "boolean" && (
            <button
              onClick={onToggleVetAvailable}
              className={`hidden md:inline-flex items-center gap-2 h-9 px-3 rounded-xl text-xs font-semibold transition-colors ${
                vetAvailable
                  ? "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 ring-1 ring-emerald-400/40"
                  : "bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 ring-1 ring-rose-400/40"
              }`}
              title="Basculer ma disponibilité urgences"
            >
              <span className={`h-2 w-2 rounded-full ${vetAvailable ? "bg-emerald-400" : "bg-rose-400"} animate-pulse`} />
              {vetAvailable ? "Disponible" : "Indisponible"}
            </button>
          )}

          {role === "guest" ? (
            <>
              <Button
                onClick={onAuth}
                variant="ghost"
                className="hidden sm:inline-flex text-slate-200 hover:text-white hover:bg-white/10 rounded-xl h-10 px-4 gap-2"
              >
                <LogIn className="h-4 w-4" /> Se connecter
              </Button>
              <Button
                onClick={onRegister ?? onAuth}
                className="bg-brand-accent text-white hover:bg-brand-accent/90 rounded-xl h-10 px-4 gap-2 shadow-md"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">S'inscrire</span>
                <span className="sm:hidden">Inscription</span>
              </Button>
            </>
          ) : (
            <>
              <NotificationsBell onSeeAll={() => onSeeAllNotifications?.()} />
              <UserMenu role={role} initials={initials} userName={userName} userEmail={userEmail} onSelect={onUserMenu} />
            </>
          )}
        </div>
      </div>

      {/* Mobile / tablet nav row */}
      <div className="lg:hidden border-t border-slate-700/60">
        <div className="mx-auto max-w-7xl px-4 flex gap-1 overflow-x-auto py-2">
          {role === "guest" &&
            GUEST_ITEMS.map((it) => <MobileNavButton key={it.key} item={it} active={active === it.key} onClick={() => onGuestNav?.(it.key)} />)}
          {role === "client" &&
            CLIENT_ITEMS.map((it) => <MobileNavButton key={it.key} item={it} active={active === it.key} onClick={() => onClientNav?.(it.key)} />)}
          {role === "veto" &&
            VETO_ITEMS.map((it) => <MobileNavButton key={it.key} item={it} active={active === it.key} onClick={() => onVetoNav?.(it.key)} />)}
        </div>
      </div>
    </header>
  );
}

function NavButton<K extends string>({ item, active, onClick }: { item: Item<K>; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  const danger = item.tone === "danger";
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
        active
          ? danger
            ? "bg-rose-500/20 text-rose-200 ring-1 ring-rose-400/40"
            : "bg-white/10 text-white"
          : danger
            ? "text-rose-300 hover:bg-rose-500/15 hover:text-rose-200"
            : "text-slate-200 hover:bg-white/5 hover:text-white"
      }`}
    >
      {Icon && <Icon className="h-4 w-4" />} {item.label}
    </button>
  );
}

function MobileNavButton<K extends string>({ item, active, onClick }: { item: Item<K>; active: boolean; onClick: () => void }) {
  const danger = item.tone === "danger";
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
        active
          ? danger ? "bg-rose-500/25 text-rose-100" : "bg-white/15 text-white"
          : danger ? "text-rose-300 hover:bg-rose-500/15" : "text-slate-200 hover:bg-white/10"
      }`}
    >
      {item.label}
    </button>
  );
}

function UserMenu({
  role, initials, userName, userEmail, onSelect,
}: {
  role: NavRole;
  initials: string;
  userName?: string | null;
  userEmail?: string | null;
  onSelect?: (k: UserMenuKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const profileLabel = role === "veto" ? "Profil du Cabinet" : "Mon Profil";
  const settingsLabel = role === "veto" ? "Paramètres Pro" : "Paramètres & sécurité";
  const ProfIcon = role === "veto" ? Briefcase : User;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="h-10 w-10 rounded-full bg-brand-accent text-white font-semibold text-sm flex items-center justify-center shadow-md ring-2 ring-white/10 hover:ring-white/30 transition-all hover:scale-105"
        aria-label="Menu utilisateur"
      >
        {initials}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 bg-card text-foreground rounded-2xl shadow-2xl border border-brand-border overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-brand-border/60 flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-brand-accent text-white font-semibold text-sm flex items-center justify-center">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-brand-title truncate">{userName || "Utilisateur"}</p>
                <p className="text-xs text-muted-foreground truncate">{userEmail || ""}</p>
                <p className="text-[10px] uppercase tracking-wider text-brand-accent font-bold mt-0.5 inline-flex items-center gap-1">
                  {role === "veto" ? <Stethoscope className="h-3 w-3" /> : <PawPrint className="h-3 w-3" />} {role === "veto" ? "Vétérinaire" : "Client"}
                </p>
              </div>
            </div>
            <div className="py-1">
              <MenuItem icon={ProfIcon} label={profileLabel} onClick={() => { setOpen(false); onSelect?.("profile"); }} />
              <MenuItem icon={Settings} label={settingsLabel} onClick={() => { setOpen(false); onSelect?.("settings"); }} />
              <div className="my-1 border-t border-brand-border/60" />
              <MenuItem icon={LogOut} label="Déconnexion" tone="danger" onClick={() => { setOpen(false); onSelect?.("logout"); }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({
  icon: Icon, label, onClick, tone = "default",
}: { icon: React.ComponentType<{ className?: string }>; label: string; onClick: () => void; tone?: "default" | "danger" }) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-2.5 text-sm font-medium flex items-center gap-3 transition-colors text-left ${
        tone === "danger"
          ? "text-rose-600 hover:bg-rose-50"
          : "text-brand-title hover:bg-brand-soft"
      }`}
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}
