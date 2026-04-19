import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Phone, Star, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CLINICS } from "./data";
import { toast } from "sonner";

type FilterKey = "open" | "emergency" | "walkIn" | "referral" | "nac";

const FILTERS: { key: FilterKey; label: string; tone: "default" | "green" | "red" }[] = [
  { key: "open", label: "Ouvert", tone: "green" },
  { key: "emergency", label: "Urgences", tone: "red" },
  { key: "walkIn", label: "Sans rendez-vous", tone: "default" },
  { key: "referral", label: "Clinique de référés", tone: "default" },
  { key: "nac", label: "NAC", tone: "default" },
];

export function ClinicSearch() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Set<FilterKey>>(new Set());

  const toggle = (k: FilterKey) => {
    const next = new Set(active);
    next.has(k) ? next.delete(k) : next.add(k);
    setActive(next);
  };

  const results = useMemo(() => {
    return CLINICS.filter((c) => {
      const q = query.trim().toLowerCase();
      if (q && !(`${c.city} ${c.address ?? ""} ${c.clinic}`.toLowerCase().includes(q))) return false;
      if (active.has("open") && !c.open) return false;
      if (active.has("emergency") && !c.emergency24) return false;
      if (active.has("walkIn") && !c.walkIn) return false;
      if (active.has("referral") && !c.referral) return false;
      if (active.has("nac") && !c.nac) return false;
      return true;
    });
  }, [query, active]);

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-title mb-2">Trouver une clinique</h1>
          <p className="text-muted-foreground mb-6">Recherchez un vétérinaire près de chez vous.</p>
        </motion.div>

        {/* Search bar */}
        <div className="bg-card rounded-xl border border-brand-border p-2 flex flex-col sm:flex-row gap-2 shadow-sm">
          <div className="relative flex-1 flex items-center">
            <MapPin className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Adresse, ville, code postal"
              className="pl-9 h-11 rounded-xl border-0 focus-visible:ring-0 bg-transparent"
            />
          </div>
          <Button className="bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 rounded-xl h-11 px-5 gap-2">
            <Search className="h-4 w-4" /> Rechercher
          </Button>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          <Pill icon={<Filter className="h-3.5 w-3.5" />} label="Filtres" />
          {FILTERS.map((f) => (
            <Pill
              key={f.key}
              label={f.label}
              tone={f.tone}
              active={active.has(f.key)}
              onClick={() => toggle(f.key)}
            />
          ))}
        </div>

        {/* Results */}
        <div className="mt-6 space-y-4">
          {results.length === 0 ? (
            <div className="bg-card rounded-xl border border-brand-border p-10 text-center text-muted-foreground">
              Aucune clinique ne correspond à vos critères.
            </div>
          ) : (
            results.map((c, i) => (
              <motion.article
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-xl border border-brand-border p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="h-11 w-11 rounded-xl bg-brand-soft flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-brand-accent" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-bold text-brand-title text-lg leading-tight truncate">{c.clinic}</h3>
                      <p className="text-sm text-muted-foreground truncate">{c.name}</p>
                    </div>
                  </div>
                  {c.rating && (
                    <div className="flex items-center gap-1 text-sm text-brand-title shrink-0">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">{c.rating}</span>
                      <span className="text-muted-foreground hidden sm:inline">({c.reviews})</span>
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {c.emergency24 && <Badge tone="red">Urgences vétérinaires 24h/24</Badge>}
                  {c.open && <Badge tone="green">Ouvert</Badge>}
                  {c.nac && <Badge>NAC</Badge>}
                  {c.walkIn && <Badge>Sans rendez-vous</Badge>}
                  {c.referral && <Badge>Référés</Badge>}
                  {c.homeVisit && <Badge>Visite à domicile</Badge>}
                </div>

                <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0" /> {c.address}
                </p>

                <button
                  onClick={() => {
                    toast.success("Appel en cours...", { description: `${c.clinic} — ${c.phone}` });
                    if (typeof window !== "undefined") window.location.href = `tel:${c.phone.replace(/\s/g, "")}`;
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-brand-accent-foreground transition-colors py-2.5 font-semibold text-sm"
                >
                  <Phone className="h-4 w-4" /> Appeler le {c.phone}
                </button>
              </motion.article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function Pill({
  label, icon, tone = "default", active, onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  tone?: "default" | "green" | "red";
  active?: boolean;
  onClick?: () => void;
}) {
  const toneClass =
    tone === "green" ? "text-emerald-700" :
    tone === "red" ? "text-brand-sos" :
    "text-brand-title";
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
        active
          ? "border-brand-accent bg-brand-soft"
          : "border-brand-border bg-card hover:bg-brand-soft/60"
      } ${toneClass}`}
    >
      {icon} {label}
    </button>
  );
}

function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "green" | "red" }) {
  const cls =
    tone === "red" ? "bg-brand-sos-soft text-brand-sos" :
    tone === "green" ? "bg-emerald-50 text-emerald-700" :
    "bg-brand-soft text-brand-title";
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>{children}</span>;
}
