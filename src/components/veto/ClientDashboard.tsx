import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarPlus, FileText, Lightbulb, Upload, Phone, CheckCircle2, Clock,
  PawPrint, Stethoscope, FileImage, Loader2, BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CLINICS, ARTICLES, type ClientProfile } from "./data";
import { SosModal } from "./SosModal";

type Tab = "rdv" | "documents" | "conseils";

export function ClientDashboard({ profile }: { profile: ClientProfile }) {
  const [tab, setTab] = useState<Tab>("rdv");
  const [sosOpen, setSosOpen] = useState(false);

  const firstName = profile.fullName.split(" ")[0] || "vous";

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 pb-28">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-title">Bonjour, {firstName} 👋</h1>
          <p className="text-muted-foreground mt-1">Voici un aperçu de la santé de vos compagnons.</p>

          <div className="flex flex-wrap gap-2 mt-5">
            <Badge className="bg-brand-soft text-brand-title hover:bg-brand-soft border-0 rounded-full px-3 py-1.5 gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-brand-accent" /> 1 RDV confirmé
            </Badge>
            <Badge className="bg-muted text-muted-foreground hover:bg-muted border-0 rounded-full px-3 py-1.5 gap-1.5">
              <Clock className="h-3.5 w-3.5" /> 0 en attente
            </Badge>
            <Badge className="bg-brand-soft text-brand-title hover:bg-brand-soft border-0 rounded-full px-3 py-1.5 gap-1.5">
              <PawPrint className="h-3.5 w-3.5 text-brand-accent" /> {profile.animals.length} animal{profile.animals.length > 1 ? "x" : ""}
            </Badge>
          </div>
        </motion.header>

        {/* Tabs */}
        <div className="bg-card rounded-xl p-1.5 border border-border/50 shadow-sm flex gap-1 mb-6 overflow-x-auto">
          <TabBtn active={tab === "rdv"} onClick={() => setTab("rdv")} icon={<CalendarPlus className="h-4 w-4" />} label="Prendre RDV" />
          <TabBtn active={tab === "documents"} onClick={() => setTab("documents")} icon={<FileText className="h-4 w-4" />} label="Mes documents" />
          <TabBtn active={tab === "conseils"} onClick={() => setTab("conseils")} icon={<Lightbulb className="h-4 w-4" />} label="Conseils" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "rdv" && <BookingForm profile={profile} />}
            {tab === "documents" && <DocumentsTab />}
            {tab === "conseils" && <ConseilsTab />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* SOS FAB */}
      <motion.button
        onClick={() => setSosOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 h-16 w-16 rounded-full bg-brand-sos text-brand-sos-foreground shadow-lg flex flex-col items-center justify-center gap-0.5"
        style={{ boxShadow: "0 10px 30px -8px oklch(0.7 0.09 20 / 0.6)" }}
        aria-label="Urgences SOS"
      >
        <Phone className="h-5 w-5" />
        <span className="text-[10px] font-bold tracking-wider">SOS</span>
      </motion.button>

      <SosModal open={sosOpen} onClose={() => setSosOpen(false)} />
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
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
    <form onSubmit={submit} className="bg-card rounded-xl p-6 md:p-8 border border-border/50 shadow-sm space-y-5">
      <h2 className="font-semibold text-brand-title text-lg flex items-center gap-2">
        <CalendarPlus className="h-5 w-5 text-brand-accent" /> Nouveau rendez-vous
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-brand-title text-sm flex items-center gap-1.5"><PawPrint className="h-3.5 w-3.5" /> Animal *</Label>
          <select
            value={animalId}
            onChange={(e) => setAnimalId(e.target.value)}
            required
            className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm text-brand-title focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {profile.animals.length === 0 && <option value="">Aucun animal enregistré</option>}
            {profile.animals.map((a) => (
              <option key={a.id} value={a.id}>{a.name || "Sans nom"} {a.species && `— ${a.species}`}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-brand-title text-sm flex items-center gap-1.5"><Stethoscope className="h-3.5 w-3.5" /> Vétérinaire *</Label>
          <select
            value={vetId}
            onChange={(e) => setVetId(e.target.value)}
            required
            className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm text-brand-title focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {CLINICS.map((v) => (
              <option key={v.id} value={v.id}>{v.clinic} — {v.city}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-brand-title text-sm">Date *</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="rounded-lg" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-brand-title text-sm">Heure *</Label>
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className="rounded-lg" />
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
          className="rounded-lg resize-none"
        />
      </div>

      <Button type="submit" size="lg" className="w-full bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 rounded-xl h-12">
        Demander le rendez-vous
      </Button>
    </form>
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
    <div className="bg-card rounded-xl p-6 md:p-8 border border-border/50 shadow-sm">
      <h2 className="font-semibold text-brand-title text-lg flex items-center gap-2 mb-5">
        <FileText className="h-5 w-5 text-brand-accent" /> Mes documents
      </h2>

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
            className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-background p-3"
          >
            <div className="h-12 w-12 rounded-lg bg-brand-soft flex items-center justify-center shrink-0">
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
  );
}

/* ---------- Conseils ---------- */
function ConseilsTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {ARTICLES.map((a, i) => (
        <motion.button
          key={a.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          whileHover={{ y: -3 }}
          onClick={() => toast.info(a.title, { description: "Article bientôt disponible" })}
          className="text-left bg-card rounded-xl p-5 border border-border/50 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="h-10 w-10 rounded-lg bg-brand-soft flex items-center justify-center mb-4">
            <BookOpen className="h-5 w-5 text-brand-accent" />
          </div>
          <p className="text-xs font-medium text-brand-accent uppercase tracking-wide mb-1.5">{a.category}</p>
          <h3 className="font-semibold text-brand-title leading-snug mb-3">{a.title}</h3>
          <p className="text-xs text-muted-foreground">⏱ {a.read} de lecture</p>
        </motion.button>
      ))}
    </div>
  );
}
