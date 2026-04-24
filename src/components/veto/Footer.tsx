import { PawPrint, Mail, Phone, MapPin, Send, Camera, AtSign } from "lucide-react";

type ScrollKey = "services" | "news" | "testimonials" | "home";

export function Footer({
  onNavigate,
  onScrollTo,
}: {
  onNavigate?: (key: "search" | "landing" | "news") => void;
  onScrollTo?: (key: ScrollKey) => void;
}) {
  const handleQuick = (key: ScrollKey) => {
    onScrollTo?.(key);
  };

  return (
    <footer className="bg-slate-800 text-slate-200 mt-20">
      <div className="mx-auto max-w-7xl px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="h-9 w-9 rounded-xl bg-brand-accent flex items-center justify-center">
              <PawPrint className="h-5 w-5 text-white" />
            </span>
            <span className="font-bold text-white text-lg">Veto-Care</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            La plateforme qui simplifie la santé de vos animaux en Algérie.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Liens rapides</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <button onClick={() => handleQuick("home")} className="text-slate-400 hover:text-brand-accent transition-colors">
                Accueil
              </button>
            </li>
            <li>
              <button onClick={() => handleQuick("services")} className="text-slate-400 hover:text-brand-accent transition-colors">
                Nos services
              </button>
            </li>
            <li>
              <button onClick={() => handleQuick("news")} className="text-slate-400 hover:text-brand-accent transition-colors">
                Actualités
              </button>
            </li>
            <li>
              <button onClick={() => handleQuick("testimonials")} className="text-slate-400 hover:text-brand-accent transition-colors">
                Témoignages
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate?.("search")} className="text-slate-400 hover:text-brand-accent transition-colors">
                Trouver une clinique
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Contact</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand-accent" />
              <a href="mailto:contact@veto-care.dz" className="hover:text-white transition-colors">contact@veto-care.dz</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand-accent" />
              <a href="tel:+213210000000" className="hover:text-white transition-colors">+213 21 00 00 00</a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-accent" /> Alger, Algérie
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Suivez-nous</h4>
          <div className="flex gap-3">
            {[
              { Icon: Send, href: "https://t.me/", label: "Telegram" },
              { Icon: Camera, href: "https://instagram.com/", label: "Instagram" },
              { Icon: AtSign, href: "https://twitter.com/", label: "X" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-brand-accent hover:bg-brand-accent hover:text-white transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700/60">
        <div className="mx-auto max-w-7xl px-6 py-5 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Veto-Care — Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
