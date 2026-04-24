import { motion } from "framer-motion";
import { Stethoscope, HeartPulse, CalendarCheck, ShieldCheck, PawPrint, ArrowRight, Quote, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroIllustration from "@/assets/hero-illustration.png";

const services = [
  { icon: CalendarCheck, title: "Rendez-vous en ligne", desc: "Prenez RDV avec un véto vérifié en quelques clics." },
  { icon: HeartPulse, title: "Suivi santé", desc: "Carnet de santé numérique pour chaque animal." },
  { icon: Stethoscope, title: "Téléconsultation", desc: "Conseils rapides à distance, 7j/7." },
  { icon: ShieldCheck, title: "Vétos vérifiés", desc: "Tous nos praticiens sont certifiés." },
];

const news = [
  {
    id: "n1",
    title: "Nutrition canine : les bons réflexes",
    category: "Nutrition",
    read: "5 min",
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80",
  },
  {
    id: "n2",
    title: "Santé des chats : les signaux à surveiller",
    category: "Santé",
    read: "4 min",
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80",
  },
  {
    id: "n3",
    title: "Vacciner son chiot : le bon calendrier",
    category: "Prévention",
    read: "6 min",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80",
  },
];

const testimonials = [
  {
    name: "Amine Benali",
    city: "Alger",
    text: "Service exceptionnel. J'ai trouvé un véto pour Pixel en moins de 10 minutes, RDV pris dans la foulée.",
    avatar: "AB",
  },
  {
    name: "Meriem Mansouri",
    city: "Oran",
    text: "Le carnet de santé numérique est génial. Je n'oublie plus jamais un rappel de vaccin pour Rocky.",
    avatar: "MM",
  },
  {
    name: "Yacine Brahimi",
    city: "Constantine",
    text: "L'urgence SOS m'a sauvé la mise un dimanche soir. Mochi a été pris en charge immédiatement.",
    avatar: "YB",
  },
];

export function Landing({
  onStart,
  onSeeServices,
  onSeeNews,
}: {
  onStart: () => void;
  onSeeServices?: () => void;
  onSeeNews?: () => void;
}) {
  return (
    <div>
      {/* Hero */}
      <section id="home" className="relative overflow-hidden px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start gap-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-1.5 text-sm font-medium text-brand-title">
              <PawPrint className="h-4 w-4" /> Plateforme vétérinaire nouvelle génération
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-brand-title leading-[1.05]">
              La santé de vos animaux,<br />
              <span className="text-brand-accent">simplifiée.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              Veto-Care connecte propriétaires et vétérinaires en Algérie pour un suivi de santé moderne, fluide et bienveillant.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                size="lg"
                onClick={onStart}
                className="bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 rounded-xl px-8 h-12 text-base gap-2"
              >
                Commencer <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onSeeServices}
                className="rounded-xl px-8 h-12 text-base border-brand-title/20 text-brand-title hover:bg-brand-soft"
              >
                En savoir plus
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative flex justify-center"
          >
            <div className="absolute inset-8 bg-brand-soft rounded-[3rem] blur-2xl opacity-60" aria-hidden />
            <img
              src={heroIllustration}
              alt="Vétérinaire examinant un chien et un chat"
              width={1024}
              height={1024}
              className="relative w-full max-w-md lg:max-w-lg drop-shadow-xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="px-6 py-20 scroll-mt-24">
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
                whileHover={{ y: -6 }}
                className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-lg transition-shadow"
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

      {/* News */}
      <section id="news" className="px-6 py-20 bg-brand-soft/40 scroll-mt-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-brand-title mb-2"
              >
                Dernières actualités
              </motion.h2>
              <p className="text-muted-foreground text-lg">Nos articles pour mieux prendre soin de votre compagnon.</p>
            </div>
            <Button onClick={onSeeNews} variant="outline" className="rounded-xl border-brand-accent text-brand-accent hover:bg-brand-soft gap-2">
              Tout voir <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {news.map((n, i) => (
              <motion.button
                key={n.id}
                onClick={onSeeNews}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="text-left bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="aspect-[16/10] bg-brand-soft overflow-hidden">
                  <img src={n.image} alt={n.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-5">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wide bg-brand-soft text-brand-accent px-2 py-0.5 rounded-full mb-2">
                    {n.category}
                  </span>
                  <h3 className="font-bold text-brand-title mb-2 line-clamp-2">{n.title}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {n.read}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-6 py-20 scroll-mt-24">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-brand-title mb-3"
          >
            Ils nous font confiance
          </motion.h2>
          <p className="text-muted-foreground mb-12 text-lg">Des propriétaires comblés, partout en Algérie.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm relative"
              >
                <Quote className="absolute top-4 right-4 h-8 w-8 text-brand-soft" />
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-brand-title/85 leading-relaxed mb-5 text-sm">« {t.text} »</p>
                <div className="flex items-center gap-3 pt-4 border-t border-brand-border/60">
                  <div className="h-10 w-10 rounded-full bg-brand-accent text-white flex items-center justify-center font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-brand-title text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
