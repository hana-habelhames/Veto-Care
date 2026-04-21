import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, MapPin, Phone, Star, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CLINICS, type Vet } from "./data";

export function ClinicPickerModal({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: (v: Vet) => void }) {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return CLINICS;
    return CLINICS.filter((c) =>
      `${c.clinic} ${c.name} ${c.city} ${c.address ?? ""}`.toLowerCase().includes(term)
    );
  }, [q]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="fixed inset-x-3 top-1/2 -translate-y-1/2 z-50 mx-auto max-w-2xl bg-card rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border/60">
              <div className="flex items-center gap-2.5">
                <span className="h-9 w-9 rounded-xl bg-brand-soft flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-brand-accent" />
                </span>
                <h2 className="font-bold text-brand-title text-lg">Choisir une clinique</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-brand-soft text-brand-title">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-4 border-b border-brand-border/60">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Rechercher par nom, ville (Alger, Oran, Constantine...)"
                  className="pl-9 rounded-xl"
                  autoFocus
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{results.length} clinique{results.length > 1 ? "s" : ""} disponible{results.length > 1 ? "s" : ""} en Algérie</p>
            </div>

            <div className="overflow-y-auto p-4 space-y-2">
              {results.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">Aucun résultat. Essayez "Alger", "Oran"...</p>
              ) : (
                results.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => { onSelect(c); onClose(); }}
                    className="w-full text-left rounded-xl border border-brand-border bg-background hover:bg-brand-soft/50 hover:border-brand-accent transition-colors p-4 flex gap-4"
                  >
                    <span className="h-11 w-11 rounded-xl bg-brand-soft flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5 text-brand-accent" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-bold text-brand-title truncate">{c.clinic}</p>
                        {c.rating && (
                          <span className="flex items-center gap-1 text-xs text-brand-title shrink-0">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {c.rating}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{c.name}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {c.city}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {c.phone}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {c.emergency24 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-sos-soft text-brand-sos font-medium">Urgences 24/7</span>}
                        {c.homeVisit && <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-soft text-brand-title font-medium">À domicile</span>}
                        {c.nac && <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-soft text-brand-title font-medium">NAC</span>}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
