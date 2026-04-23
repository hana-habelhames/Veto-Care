import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ListChecks, UserCog, PawPrint, Mail, Phone, FileImage, Eye, X,
  Clock, PlayCircle, CheckCircle2, Stethoscope, Building2, Save, Calendar,
  LayoutDashboard, Users, MessageSquare, Settings, LogOut, Menu,
  Pencil, FileText, Send, AlertTriangle, Cat, Dog, Rabbit, Bird,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type Status = "waiting" | "in_progress" | "done";

type Consultation = {
  id: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  animal: { name: string; species: string; age: string };
  reason: string;
  time: string;
  status: Status;
  startedAt?: number; // ms timestamp when set to in_progress
  history: { date: string; note: string }[];
  documents: { name: string; url: string }[];
};

const SEED: Consultation[] = [
  {
    id: "c1",
    ownerName: "Marie Dupont",
    ownerEmail: "marie.dupont@email.fr",
    ownerPhone: "+33 6 12 34 56 78",
    animal: { name: "Pixel", species: "Chat européen", age: "4 ans" },
    reason: "Vomissements répétés depuis 2 jours, perte d'appétit.",
    time: "09:00",
    status: "waiting",
    history: [
      { date: "12/03/2024", note: "Vaccin annuel — RAS" },
      { date: "08/11/2023", note: "Stérilisation — récupération normale" },
    ],
    documents: [
      { name: "carnet-sante.jpg", url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800" },
    ],
  },
  {
    id: "c2",
    ownerName: "Julien Martin",
    ownerEmail: "j.martin@email.fr",
    ownerPhone: "+33 6 98 76 54 32",
    animal: { name: "Rocky", species: "Berger australien", age: "2 ans" },
    reason: "Boiterie patte avant droite après une promenade.",
    time: "09:30",
    status: "in_progress",
    startedAt: Date.now() - 15 * 60 * 1000,
    history: [
      { date: "05/01/2024", note: "Rappel vaccin Lyme" },
      { date: "20/06/2023", note: "Consultation comportement" },
    ],
    documents: [
      { name: "photo-patte.jpg", url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800" },
      { name: "ordonnance.pdf", url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800" },
    ],
  },
  {
    id: "c3",
    ownerName: "Sophie Bernard",
    ownerEmail: "sophie.b@email.fr",
    ownerPhone: "+33 6 55 44 33 22",
    animal: { name: "Mochi", species: "Lapin nain", age: "1 an" },
    reason: "Contrôle dentaire de routine.",
    time: "10:15",
    status: "done",
    history: [{ date: "10/02/2024", note: "Première consultation — RAS" }],
    documents: [],
  },
  {
    id: "c4",
    ownerName: "Antoine Leroy",
    ownerEmail: "a.leroy@email.fr",
    ownerPhone: "+33 6 11 22 33 44",
    animal: { name: "Luna", species: "Labrador", age: "7 ans" },
    reason: "Suivi traitement arthrose senior.",
    time: "11:00",
    status: "waiting",
    history: [
      { date: "15/02/2024", note: "Bilan sénior — début traitement anti-inflammatoire" },
    ],
    documents: [
      { name: "radio-hanche.jpg", url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800" },
    ],
  },
];

const STATUS_CYCLE: Record<Status, Status> = {
  waiting: "in_progress",
  in_progress: "done",
  done: "waiting",
};

const STATUS_META: Record<Status, { label: string; classes: string; icon: typeof Clock }> = {
  waiting: { label: "En attente", classes: "bg-amber-100 text-amber-800 border-amber-200", icon: Clock },
  in_progress: { label: "En cours", classes: "bg-blue-100 text-blue-800 border-blue-200", icon: PlayCircle },
  done: { label: "Terminé", classes: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: CheckCircle2 },
};

const PRIORITY_KEYWORDS = ["vomissement", "boiterie", "saignement", "convulsion", "détresse", "urgence"];
const isPriority = (reason: string) =>
  PRIORITY_KEYWORDS.some((k) => reason.toLowerCase().includes(k));

function speciesIcon(species: string) {
  const s = species.toLowerCase();
  if (s.includes("chat")) return Cat;
  if (s.includes("lapin")) return Rabbit;
  if (s.includes("oiseau") || s.includes("perroquet")) return Bird;
  return Dog;
}

type Section = "overview" | "queue" | "patients" | "calendar" | "messages" | "profile" | "settings";

const NAV: { key: Section; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
  { key: "queue", label: "File d'attente", icon: ListChecks },
  { key: "patients", label: "Gestion Patients", icon: Users },
  { key: "calendar", label: "Calendrier", icon: Calendar },
  { key: "messages", label: "Messages", icon: MessageSquare },
  { key: "profile", label: "Mon Profil", icon: UserCog },
  { key: "settings", label: "Paramètres", icon: Settings },
];

export function VetoDashboard() {
  const { signOut, profile } = useAuth();
  const [section, setSection] = useState<Section>("queue");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [consultations, setConsultations] = useState<Consultation[]>(SEED);
  const [selected, setSelected] = useState<Consultation | null>(null);
  const [viewerDoc, setViewerDoc] = useState<{ name: string; url: string } | null>(null);

  const cycleStatus = (id: string) =>
    setConsultations((list) =>
      list.map((c) => {
        if (c.id !== id) return c;
        const next = STATUS_CYCLE[c.status];
        return {
          ...c,
          status: next,
          startedAt: next === "in_progress" ? Date.now() : c.startedAt,
        };
      })
    );

  const handleLogout = async () => {
    await signOut();
    toast.success("Déconnecté");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto max-w-7xl flex">
        <aside className="hidden md:block w-64 shrink-0 border-r border-brand-border/70 bg-card min-h-[calc(100vh-4rem)] py-6 px-3 sticky top-0">
          <SidebarContent section={section} onSelect={setSection} onLogout={handleLogout} clinicName={profile?.clinic_name ?? "Veto-Care Pro"} />
        </aside>

        <div className="md:hidden fixed top-20 left-3 z-30">
          <button onClick={() => setMobileNavOpen(true)} className="h-10 w-10 rounded-xl bg-card border border-brand-border flex items-center justify-center text-brand-title shadow">
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <AnimatePresence>
          {mobileNavOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileNavOpen(false)} className="md:hidden fixed inset-0 z-40 bg-black/50" />
              <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "tween", duration: 0.25 }} className="md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-card py-6 px-3 overflow-y-auto">
                <div className="flex justify-end mb-2"><button onClick={() => setMobileNavOpen(false)} className="p-2 text-brand-title"><X className="h-5 w-5" /></button></div>
                <SidebarContent section={section} onSelect={(s) => { setSection(s); setMobileNavOpen(false); }} onLogout={handleLogout} clinicName={profile?.clinic_name ?? "Veto-Care Pro"} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {section === "overview" && <Overview consultations={consultations} onGoQueue={() => setSection("queue")} />}
              {section === "queue" && (
                <QueueView
                  items={consultations}
                  onCycleStatus={cycleStatus}
                  onSelectOwner={setSelected}
                  onOpenDoc={setViewerDoc}
                />
              )}
              {section === "patients" && <PatientsView consultations={consultations} onSelect={setSelected} />}
              {section === "calendar" && <Placeholder title="Calendrier" icon={Calendar} text="Bientôt : visualisez vos rendez-vous semaine et mois." />}
              {section === "messages" && <Placeholder title="Messages" icon={MessageSquare} text="Bientôt : messagerie sécurisée avec vos clients." />}
              {section === "profile" && <ProfileForm initialClinic={profile?.clinic_name ?? "Clinique du Parc"} initialEmail={profile?.email ?? ""} initialPhone={profile?.phone ?? ""} />}
              {section === "settings" && <Placeholder title="Paramètres" icon={Settings} text="Bientôt : préférences, notifications et sécurité." />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <OwnerModal consultation={selected} onClose={() => setSelected(null)} onOpenDoc={setViewerDoc} />
      <ImageViewer doc={viewerDoc} onClose={() => setViewerDoc(null)} />
    </div>
  );
}

function SidebarContent({ section, onSelect, onLogout, clinicName }: { section: Section; onSelect: (s: Section) => void; onLogout: () => void; clinicName: string }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-3 mb-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
          <Stethoscope className="h-3.5 w-3.5" /> Veto-Care Pro
        </div>
        <p className="text-sm font-bold text-brand-title truncate">{clinicName}</p>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV.map((item) => {
          const active = section === item.key;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => onSelect(item.key)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${active ? "bg-brand-soft text-brand-accent" : "text-brand-title hover:bg-brand-soft/60"}`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-brand-accent" : ""}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
        <div className="my-2 border-t border-brand-border/60" />
        <button onClick={onLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-title hover:bg-brand-soft/60 text-left">
          <LogOut className="h-4 w-4" /> Me déconnecter
        </button>
      </nav>
    </div>
  );
}

/* ---------- Overview ---------- */
function Overview({ consultations, onGoQueue }: { consultations: Consultation[]; onGoQueue: () => void }) {
  const counts = consultations.reduce(
    (acc, c) => ({ ...acc, [c.status]: (acc[c.status] || 0) + 1 }),
    { waiting: 0, in_progress: 0, done: 0 } as Record<Status, number>
  );
  const priorityCount = consultations.filter((c) => isPriority(c.reason)).length;

  const cards = [
    { label: "En attente", value: counts.waiting, icon: Clock, color: "text-amber-700 bg-amber-50" },
    { label: "En cours", value: counts.in_progress, icon: PlayCircle, color: "text-blue-700 bg-blue-50" },
    { label: "Terminé", value: counts.done, icon: CheckCircle2, color: "text-emerald-700 bg-emerald-50" },
    { label: "Prioritaires", value: priorityCount, icon: AlertTriangle, color: "text-rose-700 bg-rose-50" },
  ];

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-title mb-1">Vue d'ensemble</h1>
      <p className="text-muted-foreground mb-6">Aperçu de l'activité du jour.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-card rounded-xl border border-brand-border p-5 shadow-sm">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 ${c.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-brand-title">{c.value}</p>
              <p className="text-sm text-muted-foreground">{c.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-card rounded-xl border border-brand-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-brand-title">Prochaines consultations</h2>
          <Button onClick={onGoQueue} variant="outline" size="sm" className="rounded-xl border-brand-accent text-brand-accent hover:bg-brand-soft">
            Voir tout
          </Button>
        </div>
        <div className="space-y-2">
          {consultations.slice(0, 3).map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-brand-border/70">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-sm font-semibold text-brand-title">{c.time}</span>
                <span className="text-sm text-muted-foreground truncate">{c.animal.name} · {c.ownerName}</span>
              </div>
              <StatusPill status={c.status} startedAt={c.startedAt} compact />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Queue ---------- */
function QueueView({
  items, onCycleStatus, onSelectOwner, onOpenDoc,
}: {
  items: Consultation[];
  onCycleStatus: (id: string) => void;
  onSelectOwner: (c: Consultation) => void;
  onOpenDoc: (d: { name: string; url: string }) => void;
}) {
  const [filter, setFilter] = useState<Status | "all">("all");

  const counts = items.reduce(
    (acc, c) => ({ ...acc, [c.status]: (acc[c.status] || 0) + 1 }),
    { waiting: 0, in_progress: 0, done: 0 } as Record<Status, number>
  );

  const filtered = filter === "all" ? items : items.filter((c) => c.status === filter);

  const filters: { key: Status | "all"; label: string; count: number; classes: string }[] = [
    { key: "all", label: "Tout", count: items.length, classes: "bg-brand-soft text-brand-accent border-brand-accent/30" },
    { key: "waiting", label: "En attente", count: counts.waiting, classes: "bg-amber-100 text-amber-800 border-amber-200" },
    { key: "in_progress", label: "En cours", count: counts.in_progress, classes: "bg-blue-100 text-blue-800 border-blue-200" },
    { key: "done", label: "Terminé", count: counts.done, classes: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  ];

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-title mb-1">File d'attente</h1>
      <p className="text-muted-foreground mb-6">Cliquez sur un statut pour le faire évoluer.</p>

      {/* Status filter chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {filters.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-xs font-semibold rounded-full border px-3 py-1.5 transition-all ${
                active ? `${f.classes} ring-2 ring-offset-1 ring-brand-accent/30` : "bg-card text-muted-foreground border-brand-border hover:border-brand-accent/40"
              }`}
            >
              {f.label} · {f.count}
            </button>
          );
        })}
      </div>

      <div className="bg-card rounded-xl border border-brand-border shadow-sm overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-soft/40 text-xs uppercase text-muted-foreground tracking-wider">
              <tr>
                <th className="text-left font-medium px-5 py-3">Heure</th>
                <th className="text-left font-medium px-5 py-3">Propriétaire</th>
                <th className="text-left font-medium px-5 py-3">Animal</th>
                <th className="text-left font-medium px-5 py-3">Motif</th>
                <th className="text-left font-medium px-5 py-3">Documents</th>
                <th className="text-left font-medium px-5 py-3">Statut</th>
                <th className="text-right font-medium px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const SpeciesIcon = speciesIcon(c.animal.species);
                const priority = isPriority(c.reason);
                return (
                  <tr key={c.id} className="border-t border-brand-border/60 hover:bg-brand-soft/20 transition-colors">
                    <td className="px-5 py-4 align-top">
                      <div className="font-medium text-brand-title">{c.time}</div>
                      {priority && (
                        <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-full px-1.5 py-0.5">
                          <AlertTriangle className="h-2.5 w-2.5" /> Prioritaire
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <button
                        onClick={() => onSelectOwner(c)}
                        className="text-brand-accent font-medium hover:underline text-left"
                      >
                        {c.ownerName}
                      </button>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <button onClick={() => onSelectOwner(c)} className="flex items-center gap-2 text-left group">
                        <span className="h-8 w-8 rounded-lg bg-brand-soft flex items-center justify-center shrink-0">
                          <SpeciesIcon className="h-4 w-4 text-brand-accent" />
                        </span>
                        <span>
                          <span className="font-medium text-brand-title group-hover:underline block leading-tight">{c.animal.name}</span>
                          <span className="text-muted-foreground text-xs font-light">{c.animal.species}</span>
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-4 align-top text-muted-foreground max-w-xs">
                      <p className="line-clamp-2 font-light">{c.reason}</p>
                    </td>
                    <td className="px-5 py-4 align-top">
                      {c.documents.length === 0 ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        <div className="flex gap-1.5">
                          {c.documents.map((d) => (
                            <button
                              key={d.name}
                              onClick={() => onOpenDoc(d)}
                              title={d.name}
                              className="h-9 w-9 rounded-lg bg-brand-soft flex items-center justify-center hover:bg-brand-accent/20 transition-colors"
                            >
                              <Eye className="h-4 w-4 text-brand-accent" />
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <StatusPill status={c.status} startedAt={c.startedAt} onClick={() => onCycleStatus(c.id)} />
                    </td>
                    <td className="px-5 py-4 align-top">
                      <ActionMenu />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">
                    Aucune consultation dans cette catégorie.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-brand-border/60">
          {filtered.map((c) => {
            const SpeciesIcon = speciesIcon(c.animal.species);
            const priority = isPriority(c.reason);
            return (
              <div key={c.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {c.time}
                      {priority && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-full px-1.5 py-0.5">
                          <AlertTriangle className="h-2.5 w-2.5" /> Prioritaire
                        </span>
                      )}
                    </div>
                    <button onClick={() => onSelectOwner(c)} className="text-brand-accent font-medium hover:underline text-sm">
                      {c.ownerName}
                    </button>
                    <button onClick={() => onSelectOwner(c)} className="flex items-center gap-2 mt-1">
                      <SpeciesIcon className="h-4 w-4 text-brand-accent" />
                      <span className="text-sm text-brand-title font-medium">{c.animal.name}</span>
                      <span className="text-xs text-muted-foreground">· {c.animal.species}</span>
                    </button>
                  </div>
                  <StatusPill status={c.status} startedAt={c.startedAt} onClick={() => onCycleStatus(c.id)} />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 font-light">{c.reason}</p>
                <div className="flex items-center justify-between">
                  {c.documents.length > 0 ? (
                    <div className="flex gap-1.5">
                      {c.documents.map((d) => (
                        <button
                          key={d.name}
                          onClick={() => onOpenDoc(d)}
                          className="text-xs flex items-center gap-1 rounded-lg bg-brand-soft px-2 py-1 text-brand-accent"
                        >
                          <Eye className="h-3 w-3" /> {d.name}
                        </button>
                      ))}
                    </div>
                  ) : <span />}
                  <ActionMenu />
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="px-5 py-12 text-center text-sm text-muted-foreground">Aucune consultation.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionMenu() {
  const actions = [
    { label: "Modifier la fiche", icon: Pencil, toast: "Édition de la fiche patient" },
    { label: "Émettre une ordonnance", icon: FileText, toast: "Nouvelle ordonnance" },
    { label: "Transférer le dossier", icon: Send, toast: "Transfert du dossier vers un confrère" },
  ];
  return (
    <div className="flex items-center justify-end gap-1">
      {actions.map(({ label, icon: Icon, toast: msg }) => (
        <button
          key={label}
          onClick={() => toast.info(msg)}
          title={label}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-brand-title hover:bg-brand-soft hover:text-brand-accent transition-colors"
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}

function StatusPill({ status, startedAt, onClick, compact }: { status: Status; startedAt?: number; onClick?: () => void; compact?: boolean }) {
  const m = STATUS_META[status];
  const Icon = m.icon;
  const [, force] = useState(0);

  // Re-render every 30s if in_progress to keep elapsed time fresh
  useEffect(() => {
    if (status !== "in_progress" || !startedAt) return;
    const id = setInterval(() => force((n) => n + 1), 30000);
    return () => clearInterval(id);
  }, [status, startedAt]);

  const elapsed = status === "in_progress" && startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 60000)) : null;

  const Comp: React.ElementType = onClick ? motion.button : "span";
  const motionProps = onClick ? { whileTap: { scale: 0.94 } } : {};

  return (
    <Comp
      onClick={onClick}
      {...motionProps}
      className={`inline-flex items-center gap-1.5 rounded-full border ${compact ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"} font-semibold transition-colors ${m.classes} ${onClick ? "cursor-pointer" : ""}`}
    >
      <Icon className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} /> {m.label}
      {elapsed !== null && <span className="opacity-70 font-normal">· depuis {elapsed} min</span>}
    </Comp>
  );
}

/* ---------- Patients ---------- */
function PatientsView({ consultations, onSelect }: { consultations: Consultation[]; onSelect: (c: Consultation) => void }) {
  // Unique by owner
  const unique = Array.from(new Map(consultations.map((c) => [c.ownerEmail, c])).values());

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-title mb-1">Gestion Patients</h1>
      <p className="text-muted-foreground mb-6">Vos patients et leurs propriétaires.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {unique.map((c) => {
          const SpeciesIcon = speciesIcon(c.animal.species);
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c)}
              className="text-left bg-card rounded-xl border border-brand-border p-5 shadow-sm hover:border-brand-accent/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-xl bg-brand-soft flex items-center justify-center">
                  <SpeciesIcon className="h-6 w-6 text-brand-accent" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-brand-title truncate">{c.animal.name}</p>
                  <p className="text-xs text-muted-foreground font-light">{c.animal.species} · {c.animal.age}</p>
                </div>
              </div>
              <div className="border-t border-brand-border/60 pt-3 space-y-1">
                <p className="text-sm text-brand-title font-medium">{c.ownerName}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Mail className="h-3 w-3" /> {c.ownerEmail}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Phone className="h-3 w-3" /> {c.ownerPhone}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Placeholder ---------- */
function Placeholder({ title, icon: Icon, text }: { title: string; icon: React.ComponentType<{ className?: string }>; text: string }) {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-title mb-6">{title}</h1>
      <div className="bg-card rounded-xl border border-brand-border p-12 text-center shadow-sm">
        <div className="h-16 w-16 rounded-full bg-brand-soft mx-auto mb-4 flex items-center justify-center">
          <Icon className="h-7 w-7 text-brand-accent" />
        </div>
        <p className="text-brand-title font-semibold mb-1">{title}</p>
        <p className="text-muted-foreground text-sm">{text}</p>
      </div>
    </div>
  );
}

/* ---------- Owner Modal ---------- */
function OwnerModal({
  consultation, onClose, onOpenDoc,
}: {
  consultation: Consultation | null;
  onClose: () => void;
  onOpenDoc: (d: { name: string; url: string }) => void;
}) {
  return (
    <AnimatePresence>
      {consultation && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto max-w-xl bg-card rounded-xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
          >
            <div className="bg-brand-accent text-brand-accent-foreground px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <PawPrint className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-lg truncate">{consultation.ownerName}</h2>
                  <p className="text-xs opacity-90 truncate">Dossier de {consultation.animal.name}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors shrink-0">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-5">
              <section>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Coordonnées</h3>
                <div className="space-y-2">
                  <a href={`mailto:${consultation.ownerEmail}`} className="flex items-center gap-3 text-sm text-brand-title hover:text-brand-accent">
                    <Mail className="h-4 w-4 text-brand-accent" /> {consultation.ownerEmail}
                  </a>
                  <a href={`tel:${consultation.ownerPhone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-sm text-brand-title hover:text-brand-accent">
                    <Phone className="h-4 w-4 text-brand-accent" /> {consultation.ownerPhone}
                  </a>
                </div>
              </section>

              <section>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Animal</h3>
                <div className="rounded-xl border border-brand-border bg-background p-4">
                  <p className="font-semibold text-brand-title">{consultation.animal.name}</p>
                  <p className="text-sm text-muted-foreground font-light">{consultation.animal.species} · {consultation.animal.age}</p>
                </div>
              </section>

              <section>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Historique</h3>
                <ol className="space-y-2">
                  {consultation.history.map((h, i) => (
                    <li key={i} className="rounded-xl border border-brand-border bg-background p-3 flex gap-3">
                      <div className="h-8 w-8 rounded-lg bg-brand-soft flex items-center justify-center shrink-0">
                        <Calendar className="h-4 w-4 text-brand-accent" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-brand-accent">{h.date}</p>
                        <p className="text-sm text-brand-title">{h.note}</p>
                      </div>
                    </li>
                  ))}
                  {consultation.history.length === 0 && (
                    <p className="text-sm text-muted-foreground">Aucun historique disponible.</p>
                  )}
                </ol>
              </section>

              {consultation.documents.length > 0 && (
                <section>
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Documents envoyés</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {consultation.documents.map((d) => (
                      <button
                        key={d.name}
                        onClick={() => onOpenDoc(d)}
                        className="rounded-xl border border-brand-border bg-background p-3 flex items-center gap-3 hover:border-brand-accent/50 transition-colors text-left"
                      >
                        <div className="h-10 w-10 rounded-lg bg-brand-soft flex items-center justify-center shrink-0">
                          <FileImage className="h-5 w-5 text-brand-accent" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-brand-title truncate">{d.name}</p>
                          <p className="text-[10px] text-brand-accent flex items-center gap-1">
                            <Eye className="h-3 w-3" /> Voir en grand
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------- Image Viewer ---------- */
function ImageViewer({ doc, onClose }: { doc: { name: string; url: string } | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {doc && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm flex flex-col"
          onClick={onClose}
        >
          <div className="flex items-center justify-between px-6 py-4 text-white">
            <p className="text-sm font-medium truncate">{doc.name}</p>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-6" onClick={(e) => e.stopPropagation()}>
            <motion.img
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={doc.url}
              alt={doc.name}
              className="max-h-full max-w-full rounded-xl shadow-2xl object-contain"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Profile Form ---------- */
const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

type DaySchedule = { open: boolean; from: string; to: string };

function ProfileForm({ initialClinic, initialEmail, initialPhone }: { initialClinic: string; initialEmail: string; initialPhone: string }) {
  const [clinic, setClinic] = useState(initialClinic);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [hours, setHours] = useState<Record<string, DaySchedule>>(() =>
    DAYS.reduce((acc, d) => {
      acc[d] = { open: d !== "Dimanche", from: d === "Samedi" ? "09:00" : "08:30", to: d === "Samedi" ? "13:00" : "19:00" };
      return acc;
    }, {} as Record<string, DaySchedule>)
  );

  const updateDay = (day: string, patch: Partial<DaySchedule>) =>
    setHours((h) => ({ ...h, [day]: { ...h[day], ...patch } }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profil mis à jour", { description: "Vos modifications ont été enregistrées." });
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-title mb-1">Mon Profil</h1>
      <p className="text-muted-foreground mb-6">Informations publiques de votre clinique.</p>

      <form onSubmit={submit} className="space-y-6">
        <div className="bg-card rounded-xl p-6 md:p-8 border border-brand-border shadow-sm space-y-5">
          <h2 className="font-semibold text-brand-title text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-brand-accent" /> Informations de la clinique
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-brand-title text-sm">Nom de la clinique *</Label>
              <Input value={clinic} onChange={(e) => setClinic(e.target.value)} required className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-brand-title text-sm">Email de contact *</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-brand-title text-sm">Téléphone public *</Label>
              <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="rounded-xl" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 md:p-8 border border-brand-border shadow-sm">
          <h2 className="font-semibold text-brand-title text-lg flex items-center gap-2 mb-5">
            <Clock className="h-5 w-5 text-brand-accent" /> Horaires d'ouverture
          </h2>
          <div className="space-y-2">
            {DAYS.map((day) => {
              const d = hours[day];
              return (
                <div key={day} className="rounded-xl border border-brand-border bg-background p-3 flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer min-w-[140px]">
                    <input
                      type="checkbox"
                      checked={d.open}
                      onChange={(e) => updateDay(day, { open: e.target.checked })}
                      className="h-4 w-4 accent-[var(--brand-accent)]"
                    />
                    <span className={`text-sm font-medium ${d.open ? "text-brand-title" : "text-muted-foreground"}`}>{day}</span>
                  </label>
                  {d.open ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input type="time" value={d.from} onChange={(e) => updateDay(day, { from: e.target.value })} className="rounded-xl h-9 max-w-[130px]" />
                      <span className="text-muted-foreground text-sm">→</span>
                      <Input type="time" value={d.to} onChange={(e) => updateDay(day, { to: e.target.value })} className="rounded-xl h-9 max-w-[130px]" />
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">Fermé</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 rounded-xl h-12">
          <Save className="h-4 w-4 mr-2" /> Enregistrer les modifications
        </Button>
      </form>
    </div>
  );
}
