import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X, MapPin, Copy, Check } from "lucide-react";
import { CLINICS } from "./data";
import { toast } from "sonner";

export function SosModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const emergencyVets = CLINICS.filter((v) => v.emergency24);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyPhone = async (id: string, name: string, phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedId(id);
      toast.success("Numéro copié !", { description: `${name} — ${phone}` });
      setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 2000);
    } catch {
      toast.error("Impossible de copier le numéro");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto max-w-lg bg-card rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="bg-brand-sos text-brand-sos-foreground px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Urgences Vétérinaires</h2>
                  <p className="text-xs opacity-90">Disponibles 24h/24 et 7j/7</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
              {emergencyVets.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Aucun vétérinaire d'urgence disponible.</p>
              ) : (
                emergencyVets.map((v) => (
                  <div key={v.id} className="rounded-xl border border-border bg-background p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-semibold text-brand-title truncate">{v.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{v.clinic}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> {v.city}
                      </p>
                    </div>
                    <button
                      onClick={() => copyPhone(v.id, v.name, v.phone)}
                      title="Cliquer pour copier le numéro"
                      className="flex items-center justify-center gap-2 bg-brand-sos text-brand-sos-foreground rounded-xl px-4 py-2.5 text-sm font-semibold hover:opacity-90 active:scale-95 transition-all shrink-0"
                    >
                      {copiedId === v.id ? (
                        <>
                          <Check className="h-4 w-4" /> Copié !
                        </>
                      ) : (
                        <>
                          <Phone className="h-4 w-4" />
                          <span className="tabular-nums">{v.phone}</span>
                          <Copy className="h-3.5 w-3.5 opacity-80" />
                        </>
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
