import { PawPrint, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer({ onNavigate }: { onNavigate?: (key: "search" | "landing") => void }) {
  return (
    <footer className="bg-card border-t border-brand-border/70 mt-20">
      <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="h-9 w-9 rounded-xl bg-brand-accent flex items-center justify-center">
              <PawPrint className="h-5 w-5 text-brand-accent-foreground" />
            </span>
            <span className="font-bold text-brand-title text-lg">Veto-Care</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            La plateforme qui simplifie la santé de vos animaux en Algérie.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-semibold text-brand-title mb-4 text-sm uppercase tracking-wide">Liens rapides</h4>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => onNavigate?.("landing")} className="text-muted-foreground hover:text-brand-accent transition-colors">Accueil</button></li>
            <li><button onClick={() => onNavigate?.("search")} className="text-muted-foreground hover:text-brand-accent transition-colors">Trouver une clinique</button></li>
            <li><span className="text-muted-foreground">Conseils vétérinaires</span></li>
            <li><span className="text-muted-foreground">Devenir partenaire</span></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-brand-title mb-4 text-sm uppercase tracking-wide">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand-accent" /> contact@veto-care.dz</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand-accent" /> +213 21 00 00 00</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-accent" /> Alger, Algérie</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-semibold text-brand-title mb-4 text-sm uppercase tracking-wide">Suivez-nous</h4>
          <div className="flex gap-3">
            {[Facebook, Instagram, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="h-10 w-10 rounded-xl bg-brand-soft flex items-center justify-center text-brand-accent hover:bg-brand-accent hover:text-brand-accent-foreground transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-brand-border/60">
        <div className="mx-auto max-w-7xl px-6 py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Veto-Care — Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
