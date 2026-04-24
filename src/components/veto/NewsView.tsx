import { useState } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { ARTICLES, type Article } from "./data";
import { ArticleModal } from "./ArticleModal";

export function NewsView() {
  const [active, setActive] = useState<Article | null>(null);

  return (
    <div className="px-6 py-12 mx-auto max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-brand-title mb-2">Actualités vétérinaires</h1>
        <p className="text-muted-foreground text-lg">Conseils, prévention et bien-être : nos derniers articles.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ARTICLES.map((a, i) => (
          <motion.button
            key={a.id}
            onClick={() => setActive(a)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ y: -6 }}
            className="text-left bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-lg transition-all"
          >
            <div className="aspect-[16/10] bg-brand-soft overflow-hidden">
              <img
                src={a.image}
                alt={a.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="p-5">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wide bg-brand-soft text-brand-accent px-2 py-0.5 rounded-full mb-2">
                {a.category}
              </span>
              <h3 className="font-bold text-brand-title mb-1.5 line-clamp-2">{a.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{a.excerpt}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> {a.read}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      <ArticleModal article={active} onClose={() => setActive(null)} />
    </div>
  );
}
