import { PawPrint, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

type NavKey = "home" | "services" | "news";

function getInitials(name?: string | null, email?: string | null) {
  const source = (name || email || "?").trim();
  if (!source) return "?";
  const parts = source.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export function TopNavbar({
  onLogo,
  onNav,
  onProfile,
  showAuth = false,
  onAuth,
  active,
  userName,
  userEmail,
}: {
  onLogo: () => void;
  onNav?: (key: NavKey) => void;
  onProfile?: () => void;
  showAuth?: boolean;
  onAuth?: () => void;
  active?: NavKey;
  userName?: string | null;
  userEmail?: string | null;
}) {
  const items: { key: NavKey; label: string }[] = [
    { key: "home", label: "Accueil" },
    { key: "services", label: "Nos Services" },
    { key: "news", label: "Actualités" },
  ];

  const initials = getInitials(userName, userEmail);

  return (
    <header className="sticky top-0 z-30 bg-slate-800 text-slate-100 border-b border-slate-700/60 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <button onClick={onLogo} className="flex items-center gap-2 font-bold text-lg shrink-0 text-white">
          <span className="h-9 w-9 rounded-xl bg-brand-accent flex items-center justify-center">
            <PawPrint className="h-5 w-5 text-white" />
          </span>
          <span className="hidden sm:inline">Veto-Care</span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {items.map((it) => (
            <button
              key={it.key}
              onClick={() => onNav?.(it.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                active === it.key
                  ? "bg-white/10 text-white"
                  : "text-slate-200 hover:bg-white/5 hover:text-white"
              }`}
            >
              {it.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {showAuth && onAuth && (
            <Button
              onClick={onAuth}
              className="bg-brand-accent text-white hover:bg-brand-accent/90 rounded-xl h-10 px-4 gap-2"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Se connecter / S'inscrire</span>
              <span className="sm:hidden">Connexion</span>
            </Button>
          )}
          {onProfile && !showAuth && (
            <button
              onClick={onProfile}
              className="h-10 w-10 rounded-full bg-brand-accent text-white font-semibold text-sm flex items-center justify-center shadow-md ring-2 ring-white/10 hover:ring-white/30 transition-all hover:scale-105"
              aria-label="Mon profil"
              title="Mon profil"
            >
              {initials}
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="md:hidden border-t border-slate-700/60">
        <div className="mx-auto max-w-7xl px-4 flex gap-1 overflow-x-auto py-2">
          {items.map((it) => (
            <button
              key={it.key}
              onClick={() => onNav?.(it.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                active === it.key ? "bg-white/15 text-white" : "text-slate-200 hover:bg-white/10"
              }`}
            >
              {it.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
