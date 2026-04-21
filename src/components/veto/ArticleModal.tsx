import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, BookOpen, Sparkles } from "lucide-react";
import type { Article } from "./data";

export function ArticleModal({ article, onClose }: { article: Article | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {article && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="fixed inset-x-3 top-[5vh] bottom-[5vh] z-50 mx-auto max-w-3xl bg-card rounded-xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Hero image */}
            <div className="relative h-56 sm:h-72 shrink-0 overflow-hidden bg-brand-soft">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 h-10 w-10 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center text-brand-title hover:bg-white transition-colors"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-5 right-5">
                <span className="inline-block text-xs font-semibold uppercase tracking-wide bg-brand-accent text-brand-accent-foreground px-2.5 py-1 rounded-full mb-2">
                  {article.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight drop-shadow-lg">
                  {article.title}
                </h1>
              </div>
            </div>

            {/* Body */}
            <div className="overflow-y-auto px-6 sm:px-10 py-6 sm:py-8 flex-1">
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6 pb-6 border-b border-brand-border/60">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {article.read} de lecture</span>
                <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {article.paragraphs.length} sections</span>
              </div>

              <p className="text-lg text-brand-title leading-relaxed mb-8 italic">
                {article.excerpt}
              </p>

              <div className="space-y-7">
                {article.paragraphs.map((p, i) => (
                  <section key={i}>
                    <h2 className="text-xl font-bold text-brand-title mb-3 flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-brand-accent text-brand-accent-foreground text-xs font-bold flex items-center justify-center">{i + 1}</span>
                      {p.heading}
                    </h2>
                    <p className="text-brand-title/80 leading-relaxed">{p.body}</p>
                  </section>
                ))}
              </div>

              {/* Bilan */}
              <div className="mt-10 rounded-xl bg-brand-soft border-l-4 border-brand-accent p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-brand-accent" />
                  <h3 className="font-bold text-brand-title uppercase text-sm tracking-wide">Bilan</h3>
                </div>
                <p className="text-brand-title leading-relaxed">{article.summary}</p>
              </div>

              <div className="h-4" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
