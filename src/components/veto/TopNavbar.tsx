import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PawPrint, ChevronDown, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SOINS, CONSEILS } from "./data";

type MenuKey = "soins" | "conseils" | null;

export function TopNavbar({
  onLogo,
  onSearch,
  onProfile,
  showAuth = false,
  onAuth,
}: {
  onLogo: () => void;
  onSearch: () => void;
  onProfile?: () => void;
  showAuth?: boolean;
  onAuth?: () => void;
}) {
  const [menu, setMenu] = useState<MenuKey>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setMenu(null);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header ref={wrapRef} className="relative bg-card border-b border-brand-border/70 z-30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button onClick={onLogo} className="flex items-center gap-2 text-brand-title font-bold text-lg shrink-0">
          <span className="h-9 w-9 rounded-xl bg-brand-accent flex items-center justify-center">
            <PawPrint className="h-5 w-5 text-brand-accent-foreground" />
          </span>
          <span className="hidden sm:inline">Veto-Care</span>
        </button>

        {/* Center menus */}
        <nav className="hidden lg:flex items-center gap-1">
          <NavItem label="Soins vétérinaires" active={menu === "soins"} onClick={() => setMenu(menu === "soins" ? null : "soins")} />
          <NavItem label="Conseils vétérinaires" active={menu === "conseils"} onClick={() => setMenu(menu === "conseils" ? null : "conseils")} />
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          {showAuth && onAuth && (
            <Button variant="ghost" onClick={onAuth} className="hidden sm:inline-flex text-brand-title hover:bg-brand-soft rounded-xl">
              S'inscrire
            </Button>
          )}
          {onProfile && (
            <button
              onClick={onProfile}
              className="h-10 w-10 rounded-xl border border-brand-border bg-card hover:bg-brand-soft flex items-center justify-center text-brand-title"
              aria-label="Mon profil"
            >
              <User className="h-5 w-5" />
            </button>
          )}
          <Button
            onClick={onSearch}
            className="bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 rounded-xl h-10 px-3 sm:px-4 gap-2"
          >
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Trouver une clinique</span>
            <span className="sm:hidden">Cliniques</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu links */}
      <div className="lg:hidden border-t border-brand-border/60 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex gap-1 overflow-x-auto py-2">
          <NavItem compact label="Soins" active={menu === "soins"} onClick={() => setMenu(menu === "soins" ? null : "soins")} />
          <NavItem compact label="Conseils" active={menu === "conseils"} onClick={() => setMenu(menu === "conseils" ? null : "conseils")} />
        </div>
      </div>

      {/* Mega menus */}
      <AnimatePresence>
        {menu === "soins" && (
          <MegaMenu key="soins" onClose={() => setMenu(null)}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-2">
              {SOINS.map((col, i) => (
                <ul key={i} className="space-y-1">
                  {col.map((item) => (
                    <li key={item}>
                      <button className="w-full text-left rounded-xl px-3 py-2 text-brand-title hover:bg-brand-soft transition-colors text-sm">
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-brand-border/60">
              <button className="text-brand-accent font-semibold text-sm hover:underline">
                Tous nos soins vétérinaires →
              </button>
            </div>
          </MegaMenu>
        )}
        {menu === "conseils" && (
          <MegaMenu key="conseils" onClose={() => setMenu(null)}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
              {Object.entries(CONSEILS).map(([cat, items]) => (
                <div key={cat}>
                  <p className="text-xs font-bold uppercase tracking-wide text-brand-accent mb-2">Conseils pour les {cat.toLowerCase()}</p>
                  <ul className="space-y-1">
                    {items.map((it) => (
                      <li key={it}>
                        <button className="w-full text-left rounded-lg px-2 py-1.5 text-brand-title hover:bg-brand-soft transition-colors text-sm">
                          {it}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-brand-border/60">
              <button className="text-brand-accent font-semibold text-sm hover:underline">
                Tous nos conseils vétérinaires →
              </button>
            </div>
          </MegaMenu>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavItem({ label, active, onClick, compact }: { label: string; active: boolean; onClick: () => void; compact?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 rounded-xl ${compact ? "px-3 py-1.5 text-sm" : "px-3 py-2"} font-medium transition-colors whitespace-nowrap ${
        active ? "bg-brand-soft text-brand-title" : "text-brand-title hover:bg-brand-soft/60"
      }`}
    >
      {label} <ChevronDown className={`h-4 w-4 transition-transform ${active ? "rotate-180" : ""}`} />
    </button>
  );
}

function MegaMenu({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 top-16 bg-black/10 z-20"
      />
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.18 }}
        className="absolute left-0 right-0 top-full bg-card border-b border-brand-border/70 shadow-lg z-30"
      >
        <div className="mx-auto max-w-7xl px-6 py-6">{children}</div>
      </motion.div>
    </>
  );
}
