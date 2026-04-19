import { motion } from "framer-motion";
import { PawPrint, Stethoscope, ArrowRight } from "lucide-react";

export function RoleSelect({ onSelect, onBack }: { onSelect: (r: "client" | "veto") => void; onBack: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <button onClick={onBack} className="text-sm text-muted-foreground hover:text-brand-title mb-6">← Retour</button>
          <h1 className="text-4xl md:text-5xl font-bold text-brand-title mb-3">Bienvenue !</h1>
          <p className="text-lg text-muted-foreground">Comment souhaitez-vous utiliser Veto-Care ?</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { id: "client" as const, icon: PawPrint, title: "Propriétaire", desc: "Je veux gérer la santé de mon animal." },
            { id: "veto" as const, icon: Stethoscope, title: "Vétérinaire", desc: "Je suis professionnel de santé animale." },
          ].map((r, i) => (
            <motion.button
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(r.id)}
              className="group bg-card rounded-xl p-8 text-left border border-border/50 shadow-sm hover:border-brand-accent transition-colors"
            >
              <div className="h-14 w-14 rounded-xl bg-brand-soft flex items-center justify-center mb-5 group-hover:bg-brand-accent transition-colors">
                <r.icon className="h-7 w-7 text-brand-accent group-hover:text-brand-accent-foreground transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-brand-title mb-2">{r.title}</h3>
              <p className="text-muted-foreground mb-4">{r.desc}</p>
              <span className="inline-flex items-center gap-1.5 text-brand-accent font-medium">
                Continuer <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
