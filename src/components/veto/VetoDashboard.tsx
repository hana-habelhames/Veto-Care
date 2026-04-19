import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ListChecks, UserCog, PawPrint, Mail, Phone, FileImage, Eye, X,
  Clock, PlayCircle, CheckCircle2, Stethoscope, Building2, Save, Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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

type VetoTab = "queue" | "profile";

export function VetoDashboard() {
  const [tab, setTab] = useState<VetoTab>("queue");
  const [consultations, setConsultations] = useState<Consultation[]>(SEED);
  const [selected, setSelected] = useState<Consultation | null>(null);
  const [viewerDoc, setViewerDoc] = useState<{ name: string; url: string } | null>(null);

  const cycleStatus = (id: string) =>
    setConsultations((list) =>
      list.map((c) => (c.id === id ? { ...c, status: STATUS_CYCLE[c.status] } : c))
    );

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 text-sm text-brand-accent font-medium mb-1">
            <Stethoscope className="h-4 w-4" /> Veto-Care Pro
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-title">Espace vétérinaire</h1>
        </motion.header>

        {/* Nav */}
        <div className="bg-card rounded-xl p-1.5 border border-border/50 shadow-sm flex gap-1 mb-6 overflow-x-auto">
          <NavBtn active={tab === "queue"} onClick={() => setTab("queue")} icon={<ListChecks className="h-4 w-4" />} label="File d'attente" />
          <NavBtn active={tab === "profile"} onClick={() => setTab("profile")} icon={<UserCog className="h-4 w-4" />} label="Mon Profil" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "queue" && (
              <QueueTable
                items={consultations}
                onCycleStatus={cycleStatus}
                onSelectOwner={setSelected}
                onOpenDoc={setViewerDoc}
              />
            )}
            {tab === "profile" && <ProfileForm />}
          </motion.div>
        </AnimatePresence>
      </div>

      <OwnerModal consultation={selected} onClose={() => setSelected(null)} onOpenDoc={setViewerDoc} />
      <ImageViewer doc={viewerDoc} onClose={() => setViewerDoc(null)} />
    </div>
  );
}

function NavBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 min-w-fit flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
        active ? "bg-brand-accent text-brand-accent-foreground" : "text-brand-title hover:bg-muted"
      }`}
    >
      {icon} {label}
    </button>
  );
}

/* ---------- Queue ---------- */
function QueueTable({
  items, onCycleStatus, onSelectOwner, onOpenDoc,
}: {
  items: Consultation[];
  onCycleStatus: (id: string) => void;
  onSelectOwner: (c: Consultation) => void;
  onOpenDoc: (d: { name: string; url: string }) => void;
}) {
  const counts = items.reduce(
    (acc, c) => ({ ...acc, [c.status]: (acc[c.status] || 0) + 1 }),
    {} as Record<Status, number>
  );

  return (
    <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border/50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-brand-title text-lg flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-brand-accent" /> Consultations du jour
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Cliquez sur un statut pour le faire évoluer.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["waiting", "in_progress", "done"] as Status[]).map((s) => {
            const m = STATUS_META[s];
            return (
              <span key={s} className={`text-xs font-medium rounded-full border px-2.5 py-1 ${m.classes}`}>
                {m.label} · {counts[s] || 0}
              </span>
            );
          })}
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground tracking-wider">
            <tr>
              <th className="text-left font-medium px-6 py-3">Heure</th>
              <th className="text-left font-medium px-6 py-3">Propriétaire</th>
              <th className="text-left font-medium px-6 py-3">Animal</th>
              <th className="text-left font-medium px-6 py-3">Motif</th>
              <th className="text-left font-medium px-6 py-3">Documents</th>
              <th className="text-left font-medium px-6 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-t border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4 font-medium text-brand-title">{c.time}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onSelectOwner(c)}
                    className="text-brand-accent font-medium hover:underline"
                  >
                    {c.ownerName}
                  </button>
                </td>
                <td className="px-6 py-4 text-brand-title">
                  <span className="font-medium">{c.animal.name}</span>
                  <span className="text-muted-foreground text-xs block">{c.animal.species}</span>
                </td>
                <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{c.reason}</td>
                <td className="px-6 py-4">
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
                <td className="px-6 py-4">
                  <StatusPill status={c.status} onClick={() => onCycleStatus(c.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-border/50">
        {items.map((c) => (
          <div key={c.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">{c.time}</div>
                <button onClick={() => onSelectOwner(c)} className="text-brand-accent font-medium hover:underline text-sm">
                  {c.ownerName}
                </button>
                <div className="text-sm text-brand-title mt-0.5">
                  <span className="font-medium">{c.animal.name}</span>
                  <span className="text-muted-foreground"> · {c.animal.species}</span>
                </div>
              </div>
              <StatusPill status={c.status} onClick={() => onCycleStatus(c.id)} />
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{c.reason}</p>
            {c.documents.length > 0 && (
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusPill({ status, onClick }: { status: Status; onClick: () => void }) {
  const m = STATUS_META[status];
  const Icon = m.icon;
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${m.classes}`}
    >
      <Icon className="h-3.5 w-3.5" /> {m.label}
    </motion.button>
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
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="font-semibold text-brand-title">{consultation.animal.name}</p>
                  <p className="text-sm text-muted-foreground">{consultation.animal.species} · {consultation.animal.age}</p>
                </div>
              </section>

              <section>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Historique</h3>
                <ol className="space-y-2">
                  {consultation.history.map((h, i) => (
                    <li key={i} className="rounded-xl border border-border bg-background p-3 flex gap-3">
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
                        className="rounded-xl border border-border bg-background p-3 flex items-center gap-3 hover:border-brand-accent/50 transition-colors text-left"
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

function ProfileForm() {
  const [clinic, setClinic] = useState("Clinique du Parc");
  const [email, setEmail] = useState("contact@clinique-du-parc.fr");
  const [phone, setPhone] = useState("+33 4 78 12 34 56");
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
    <form onSubmit={submit} className="space-y-6">
      <div className="bg-card rounded-xl p-6 md:p-8 border border-border/50 shadow-sm space-y-5">
        <h2 className="font-semibold text-brand-title text-lg flex items-center gap-2">
          <Building2 className="h-5 w-5 text-brand-accent" /> Informations de la clinique
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-brand-title text-sm">Nom de la clinique *</Label>
            <Input value={clinic} onChange={(e) => setClinic(e.target.value)} required className="rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-brand-title text-sm">Email de contact *</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-brand-title text-sm">Téléphone public *</Label>
            <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="rounded-lg" />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 md:p-8 border border-border/50 shadow-sm">
        <h2 className="font-semibold text-brand-title text-lg flex items-center gap-2 mb-5">
          <Clock className="h-5 w-5 text-brand-accent" /> Horaires d'ouverture
        </h2>
        <div className="space-y-2">
          {DAYS.map((day) => {
            const d = hours[day];
            return (
              <div key={day} className="rounded-xl border border-border bg-background p-3 flex flex-wrap items-center gap-3">
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
                    <Input type="time" value={d.from} onChange={(e) => updateDay(day, { from: e.target.value })} className="rounded-lg h-9 max-w-[130px]" />
                    <span className="text-muted-foreground text-sm">→</span>
                    <Input type="time" value={d.to} onChange={(e) => updateDay(day, { to: e.target.value })} className="rounded-lg h-9 max-w-[130px]" />
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
  );
}
