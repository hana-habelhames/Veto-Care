import { motion } from "framer-motion";
import { Stethoscope, HeartPulse, CalendarCheck, ShieldCheck, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  { icon: CalendarCheck, title: "Rendez-vous en ligne", desc: "Prenez RDV avec un véto vérifié en quelques clics." },
  { icon: HeartPulse, title: "Suivi santé", desc: "Carnet de santé numérique pour chaque animal." },
  { icon: Stethoscope, title: "Téléconsultation", desc: "Conseils rapides à distance, 7j/7." },
  { icon: ShieldCheck, title: "Vétos vérifiés", desc: "Tous nos praticiens sont certifiés." },
];

export function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start gap-6 max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-1.5 text-sm font-medium text-brand-title">
              <PawPrint className="h-4 w-4" /> Plateforme vétérinaire nouvelle génération
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-brand-title leading-[1.05]">
              La santé de vos animaux,<br />
              <span className="text-brand-accent">simplifiée.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Veto-Care connecte propriétaires et vétérinaires pour un suivi de santé moderne,
              fluide et bienveillant.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" onClick={onStart} className="bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 rounded-xl px-8 h-12 text-base">
                Commencer
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl px-8 h-12 text-base border-brand-title/20 text-brand-title hover:bg-brand-soft">
                En savoir plus
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-brand-title mb-3"
          >
            Nos services
          </motion.h2>
          <p className="text-muted-foreground mb-12 text-lg">Tout ce dont vous avez besoin, au même endroit.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-card rounded-xl p-6 shadow-sm border border-border/50"
              >
                <div className="h-12 w-12 rounded-xl bg-brand-soft flex items-center justify-center mb-4">
                  <s.icon className="h-6 w-6 text-brand-accent" />
                </div>
                <h3 className="font-semibold text-brand-title text-lg mb-1.5">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
