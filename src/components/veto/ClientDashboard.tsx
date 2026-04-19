import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarPlus, FileText, Lightbulb, Upload, CheckCircle2, Loader2,
  PawPrint, Stethoscope, FileImage, BookOpen, Calendar as CalendarIcon,
  Building2, User, Settings, LogOut, Plus, MapPin, Menu, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CLINICS, ARTICLES, type ClientProfile, type Animal } from "./data";
import { AnimalModal } from "./AnimalModal";

type Section = "rdv" | "clinics" | "animals" | "profile" | "settings" | "booking" | "documents" | "conseils";

const NAV: { key: Section; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "rdv", label: "Mes rendez-vous", icon: CalendarIcon },
  { key: "booking", label: "Prendre RDV", icon: CalendarPlus },
  { key: "clinics", label: "Mes cliniques consultées", icon: Building2 },
  { key: "animals", label: "Mes animaux", icon: PawPrint },
  { key: "documents", label: "Mes documents", icon: FileText },
  { key: "conseils", label: "Conseils", icon: Lightbulb },
  { key: "profile", label: "Mon profil", icon: User },
  { key: "settings", label: "Paramètres & sécurité", icon: Settings },
];

export function ClientDashboard({
  profile,
  setProfile,
  onLogout,
  onFindClinic,
}: {
  profile: ClientProfile;
  setProfile: (p: ClientProfile) => void;
  onLogout: () => void;
  onFindClinic: () => void;
}) {
  const [section, setSection] = useState<Section>("rdv");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const firstName = profile.fullName.split(" ")[0] || "vous";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto max-w-7xl flex">
        {/* Sidebar desktop */}
        <aside className="hidden md:block w-64 shrink-0 border-r border-brand-border/70 bg-card min-h-[calc(100vh-4rem)] py-6 px-3 sticky top-0">
          <SidebarContent
            section={section}
            onSelect={(s) => setSection(s)}
            onLogout={onLogout}
          />
        </aside>

        {/* Mobile nav trigger */}
        <div className="md:hidden fixed top-20 left-3 z-30">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="h-10 w-10 rounded-xl bg-card border border-brand-border flex items-center justify-center text-brand-title shadow"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <AnimatePresence>
          {mobileNavOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setMobileNavOpen(false)}
                className="md:hidden fixed inset-0 z-40 bg-black/50"
              />
              <motion.aside
                initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.25 }}
                className="md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-card py-6 px-3 overflow-y-auto"
              >
                <div className="flex justify-end mb-2">
                  <button onClick={() => setMobileNavOpen(false)} className="p-2 text-brand-title">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <SidebarContent
                  section={section}
                  onSelect={(s) => { setSection(s); setMobileNavOpen(false); }}
                  onLogout={onLogout}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main */}
        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {section === "rdv" && <EmptyAppointments firstName={firstName} onFindClinic={onFindClinic} />}
              {section === "booking" && <BookingForm profile={profile} />}
              {section === "clinics" && <EmptyState
                icon={<Building2 className="h-10 w-10 text-brand-accent" />}
                title="Aucune clinique consultée pour le moment"
                cta="Trouver une clinique"
                onCta={onFindClinic}
              />}
              {section === "animals" && <AnimalsTab profile={profile} setProfile={setProfile} />}
              {section === "documents" && <DocumentsTab />}
              {section === "conseils" && <ConseilsTab />}
              {section === "profile" && <ProfileTab profile={profile} setProfile={setProfile} />}
              {section === "settings" && <SettingsTab />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  section, onSelect, onLogout,
}: { section: Section; onSelect: (s: Section) => void; onLogout: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = section === item.key;
        const Icon = item.icon;
        return (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
              active
                ? "bg-brand-soft text-brand-accent"
                : "text-brand-title hover:bg-brand-soft/60"
            }`}
          >
            <Icon className={`h-4 w-4 ${active ? "text-brand-accent" : ""}`} />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
      <div className="my-2 border-t border-brand-border/60" />
      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-title hover:bg-brand-soft/60 text-left"
      >
        <LogOut className="h-4 w-4" />
        Me déconnecter
      </button>
    </nav>
  );
}

/* ---------- Empty state ---------- */
function EmptyAppointments({ firstName, onFindClinic }: { firstName: string; onFindClinic: () => void }) {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-title mb-1">Bonjour, {firstName} 👋</h1>
      <p className="text-muted-foreground mb-8">Voici un aperçu de vos rendez-vous.</p>

      <div className="bg-card rounded-xl border border-brand-border p-8 sm:p-16 flex flex-col items-center justify-center text-center min-h-[420px]">
        <div className="h-20 w-20 rounded-full bg-brand-soft flex items-center justify-center mb-6">
          <CalendarIcon className="h-10 w-10 text-brand-accent" />
        </div>
        <h2 className="text-xl font-semibold text-brand-title mb-2 max-w-md">
          Vous n'avez pas encore pris de rendez-vous dans une de nos cliniques
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Trouvez une clinique près de chez vous et prenez rendez-vous en quelques clics.
        </p>
        <Button
          onClick={onFindClinic}
          className="bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 rounded-xl h-12 px-6 gap-2"
        >
          <MapPin className="h-4 w-4" /> Trouver une clinique
        </Button>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, cta, onCta }: { icon: React.ReactNode; title: string; cta?: string; onCta?: () => void }) {
  return (
    <div className="bg-card rounded-xl border border-brand-border p-8 sm:p-16 flex flex-col items-center justify-center text-center min-h-[420px]">
      <div className="h-20 w-20 rounded-full bg-brand-soft flex items-center justify-center mb-6">{icon}</div>
      <h2 className="text-xl font-semibold text-brand-title mb-6 max-w-md">{title}</h2>
      {cta && onCta && (
        <Button onClick={onCta} className="bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 rounded-xl h-12 px-6">
          {cta}
        </Button>
      )}
    </div>
  );
}

/* ---------- Booking ---------- */
function BookingForm({ profile }: { profile: ClientProfile }) {
  const [animalId, setAnimalId] = useState(profile.animals[0]?.id ?? "");
  const [vetId, setVetId] = useState(CLINICS[0].id);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const animal = profile.animals.find((a) => a.id === animalId);
    const vet = CLINICS.find((v) => v.id === vetId);
    toast.success("Rendez-vous demandé", {
      description: `${animal?.name || "Animal"} — ${vet?.clinic} le ${date} à ${time}`,
    });
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-title mb-6">Prendre rendez-vous</h1>
      <form onSubmit={submit} className="bg-card rounded-xl p-6 md:p-8 border border-brand-border space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-brand-title text-sm flex items-center gap-1.5"><PawPrint className="h-3.5 w-3.5" /> Animal *</Label>
            <select
              value={animalId}
              onChange={(e) => setAnimalId(e.target.value)}
              required
              className="w-full h-10 rounded-xl border border-brand-border bg-background px-3 text-sm text-brand-title focus:outline-none focus:ring-2 focus:ring-brand-accent/40"
            >
              {profile.animals.length === 0 && <option value="">Aucun animal enregistré</option>}
              {profile.animals.map((a) => (
                <option key={a.id} value={a.id}>{a.name || "Sans nom"} {a.species && `— ${a.species}`}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-brand-title text-sm flex items-center gap-1.5"><Stethoscope className="h-3.5 w-3.5" /> Clinique *</Label>
            <select
              value={vetId}
              onChange={(e) => setVetId(e.target.value)}
              required
              className="w-full h-10 rounded-xl border border-brand-border bg-background px-3 text-sm text-brand-title focus:outline-none focus:ring-2 focus:ring-brand-accent/40"
            >
              {CLINICS.map((v) => (
                <option key={v.id} value={v.id}>{v.clinic} — {v.city}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-brand-title text-sm">Date *</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-brand-title text-sm">Heure *</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className="rounded-xl" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-brand-title text-sm">Motif de la consultation *</Label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={5}
            required
            placeholder="Décrivez les symptômes, le contexte ou la raison de la visite..."
            className="rounded-xl resize-none"
          />
        </div>

        <Button type="submit" size="lg" className="w-full bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 rounded-xl h-12">
          Demander le rendez-vous
        </Button>
      </form>
    </div>
  );
}

/* ---------- Animals ---------- */
function AnimalsTab({ profile, setProfile }: { profile: ClientProfile; setProfile: (p: ClientProfile) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-title">Mes animaux</h1>
        <Button onClick={() => setOpen(true)} className="bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 rounded-xl gap-2">
          <Plus className="h-4 w-4" /> Ajouter
        </Button>
      </div>

      {profile.animals.length === 0 ? (
        <EmptyState icon={<PawPrint className="h-10 w-10 text-brand-accent" />} title="Aucun animal enregistré" cta="Ajouter un animal" onCta={() => setOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profile.animals.map((a) => (
            <div key={a.id} className="bg-card rounded-xl border border-brand-border p-5">
              <div className="h-12 w-12 rounded-xl bg-brand-soft flex items-center justify-center mb-3">
                <PawPrint className="h-6 w-6 text-brand-accent" />
              </div>
              <p className="font-bold text-brand-title">{a.name}</p>
              <p className="text-sm text-muted-foreground">{a.species}{a.breed && ` · ${a.breed}`}</p>
              {a.sex && <p className="text-xs text-muted-foreground mt-1">{a.sex === "M" ? "Mâle" : "Femelle"}{a.sterilized ? " · Stérilisé" : ""}{a.insured ? " · Assuré" : ""}</p>}
            </div>
          ))}
        </div>
      )}

      <AnimalModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={(animal: Animal) => {
          setProfile({ ...profile, animals: [...profile.animals, animal] });
          toast.success("Animal ajouté", { description: animal.name });
        }}
      />
    </div>
  );
}

/* ---------- Profile ---------- */
function ProfileTab({ profile, setProfile }: { profile: ClientProfile; setProfile: (p: ClientProfile) => void }) {
  const [draft, setDraft] = useState(profile);
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-title mb-6">Mon profil</h1>
      <form
        onSubmit={(e) => { e.preventDefault(); setProfile(draft); toast.success("Profil mis à jour"); }}
        className="bg-card rounded-xl p-6 md:p-8 border border-brand-border space-y-5 max-w-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-brand-title text-sm">Nom complet</Label>
            <Input value={draft.fullName} onChange={(e) => setDraft({ ...draft, fullName: e.target.value })} className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-brand-title text-sm">Email</Label>
            <Input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-brand-title text-sm">Téléphone</Label>
            <Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-brand-title text-sm">Adresse</Label>
            <Input value={draft.address ?? ""} onChange={(e) => setDraft({ ...draft, address: e.target.value, city: e.target.value })} className="rounded-xl" />
          </div>
        </div>
        <Button type="submit" className="bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 rounded-xl">Enregistrer</Button>
      </form>
    </div>
  );
}

function SettingsTab() {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-title mb-6">Paramètres & sécurité</h1>
      <div className="bg-card rounded-xl p-6 md:p-8 border border-brand-border max-w-2xl space-y-4">
        <p className="text-muted-foreground">Bientôt : modification du mot de passe, notifications et préférences de confidentialité.</p>
      </div>
    </div>
  );
}

/* ---------- Documents ---------- */
function DocumentsTab() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<{ name: string; size: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onPick = (f: File | undefined) => {
    if (!f) return;
    setLoading(true);
    setFile(null);
    setTimeout(() => {
      setLoading(false);
      setFile({ name: f.name, size: f.size });
      toast.success("Document ajouté", { description: f.name });
    }, 1200);
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-title mb-6">Mes documents</h1>
      <div className="bg-card rounded-xl p-6 md:p-8 border border-brand-border">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="w-full rounded-xl border-2 border-dashed border-brand-accent/40 bg-brand-soft/30 hover:bg-brand-soft/60 transition-colors p-8 flex flex-col items-center justify-center gap-3 text-center"
        >
          {loading ? (
            <>
              <Loader2 className="h-8 w-8 text-brand-accent animate-spin" />
              <p className="text-sm text-brand-title font-medium">Chargement en cours...</p>
            </>
          ) : (
            <>
              <div className="h-12 w-12 rounded-full bg-brand-accent/10 flex items-center justify-center">
                <Upload className="h-6 w-6 text-brand-accent" />
              </div>
              <p className="text-sm font-medium text-brand-title">Scanner le carnet de santé ou photo de la plaie</p>
              <p className="text-xs text-muted-foreground">PNG, JPG ou PDF — 10 Mo max</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => onPick(e.target.files?.[0])}
          />
        </button>

        <AnimatePresence>
          {file && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 flex items-center gap-3 rounded-xl border border-brand-border bg-background p-3"
            >
              <div className="h-12 w-12 rounded-xl bg-brand-soft flex items-center justify-center shrink-0">
                <FileImage className="h-6 w-6 text-brand-accent" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-brand-title truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} Ko</p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-brand-accent shrink-0" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- Conseils ---------- */
function ConseilsTab() {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-title mb-6">Conseils</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ARTICLES.map((a, i) => (
          <motion.button
            key={a.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ y: -3 }}
            onClick={() => toast.info(a.title, { description: "Article bientôt disponible" })}
            className="text-left bg-card rounded-xl p-5 border border-brand-border hover:shadow-md transition-shadow"
          >
            <div className="h-10 w-10 rounded-xl bg-brand-soft flex items-center justify-center mb-4">
              <BookOpen className="h-5 w-5 text-brand-accent" />
            </div>
            <p className="text-xs font-medium text-brand-accent uppercase tracking-wide mb-1.5">{a.category}</p>
            <h3 className="font-semibold text-brand-title leading-snug mb-3">{a.title}</h3>
            <p className="text-xs text-muted-foreground">⏱ {a.read} de lecture</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
