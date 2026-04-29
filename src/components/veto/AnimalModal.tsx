import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, PawPrint, NotebookText, Upload, FileText, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Animal } from "./data";

export type PendingDoc = { file: File; category: "health_book" | "other" };

export function AnimalModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (animal: Animal, docs: PendingDoc[]) => void;
}) {
  const [sex, setSex] = useState<"M" | "F" | "">("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [insured, setInsured] = useState<boolean | null>(null);
  const [sterilized, setSterilized] = useState<boolean | null>(null);
  const [pendingDocs, setPendingDocs] = useState<PendingDoc[]>([]);

  useEffect(() => {
    if (!open) {
      setSex(""); setName(""); setBirthDate(""); setSpecies("");
      setBreed(""); setInsured(null); setSterilized(null); setPendingDocs([]);
    }
  }, [open]);

  const valid =
    sex !== "" && name.trim() !== "" && species !== "" && breed !== "" &&
    insured !== null && sterilized !== null;

  const submit = () => {
    if (!valid) return;
    onSave({
      id: crypto.randomUUID(),
      name: name.trim(),
      species,
      breed,
      sex: sex as "M" | "F",
      birthDate,
      insured: !!insured,
      sterilized: !!sterilized,
    }, pendingDocs);
    onClose();
  };

  const addFiles = (files: FileList | null, category: "health_book" | "other") => {
    if (!files) return;
    const next: PendingDoc[] = Array.from(files).map((file) => ({ file, category }));
    setPendingDocs((p) => [...p, ...next]);
  };
  const removeDoc = (idx: number) => setPendingDocs((p) => p.filter((_, i) => i !== idx));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="fixed inset-x-3 top-1/2 -translate-y-1/2 z-50 mx-auto max-w-xl bg-card rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border/60">
              <div className="flex items-center gap-2.5">
                <span className="h-9 w-9 rounded-xl bg-brand-soft flex items-center justify-center">
                  <PawPrint className="h-5 w-5 text-brand-accent" />
                </span>
                <h2 className="font-bold text-brand-title text-lg">Ajouter un animal</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-brand-soft text-brand-title">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto p-6 space-y-6">
              {/* Identity */}
              <Section title="Identité">
                <RadioRow
                  label="Sexe *"
                  options={[{ v: "M", l: "Mâle" }, { v: "F", l: "Femelle" }]}
                  value={sex}
                  onChange={(v) => setSex(v as "M" | "F")}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-brand-title text-sm">Nom de l'animal *</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex. Pacha" className="rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-brand-title text-sm">Date de naissance</Label>
                    <Input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      placeholder="jj/mm/aaaa"
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-brand-title text-sm">Espèce *</Label>
                    <Input
                      value={species}
                      onChange={(e) => setSpecies(e.target.value)}
                      placeholder="Ex. Chien, Chat, Lapin..."
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-brand-title text-sm">Race *</Label>
                    <Input
                      value={breed}
                      onChange={(e) => setBreed(e.target.value)}
                      placeholder="Ex. Berger Allemand, Siamois..."
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </Section>

              {/* Health */}
              <Section title="Santé">
                <RadioRow
                  label="Assurance *"
                  options={[{ v: "no", l: "Pas assuré" }, { v: "yes", l: "Assuré" }]}
                  value={insured === null ? "" : insured ? "yes" : "no"}
                  onChange={(v) => setInsured(v === "yes")}
                />
                <RadioRow
                  label="Stérilisation *"
                  options={[{ v: "no", l: "Pas stérilisé" }, { v: "yes", l: "Stérilisé" }]}
                  value={sterilized === null ? "" : sterilized ? "yes" : "no"}
                  onChange={(v) => setSterilized(v === "yes")}
                />
              </Section>

              {/* Documents */}
              <Section title="Mes documents associés">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <FileSlot
                    label="Carnet de santé"
                    icon={NotebookText}
                    onPick={(files) => addFiles(files, "health_book")}
                  />
                  <FileSlot
                    label="Autres documents"
                    icon={Upload}
                    multiple
                    onPick={(files) => addFiles(files, "other")}
                  />
                </div>
                {pendingDocs.length > 0 && (
                  <ul className="space-y-1.5 pt-1">
                    {pendingDocs.map((d, i) => (
                      <li key={i} className="flex items-center gap-2 rounded-lg border border-brand-border bg-background px-3 py-2 text-xs">
                        {d.category === "health_book" ? (
                          <NotebookText className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                        ) : (
                          <FileText className="h-3.5 w-3.5 text-brand-accent shrink-0" />
                        )}
                        <span className="flex-1 truncate text-brand-title">{d.file.name}</span>
                        <span className="text-muted-foreground">{Math.round(d.file.size / 1024)} Ko</span>
                        <button type="button" onClick={() => removeDoc(i)} className="text-rose-600 hover:bg-rose-50 rounded p-1">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-[11px] text-muted-foreground">Les documents seront automatiquement associés à cet animal et accessibles depuis « Mes documents associés ».</p>
              </Section>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-brand-border/60 flex justify-end gap-3 bg-card">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-5 py-2.5 text-sm font-medium text-brand-title hover:bg-brand-soft transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={!valid}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
                  valid
                    ? "bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90"
                    : "bg-brand-border text-white cursor-not-allowed"
                }`}
              >
                Valider
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wide text-brand-accent">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function RadioRow({
  label, options, value, onChange,
}: {
  label: string;
  options: { v: string; l: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-brand-title text-sm">{label}</Label>
      <div className="flex gap-2">
        {options.map((o) => {
          const active = value === o.v;
          return (
            <button
              key={o.v}
              type="button"
              onClick={() => onChange(o.v)}
              className={`flex-1 h-11 rounded-xl border-2 text-sm font-medium transition-all ${
                active
                  ? "border-brand-accent bg-brand-soft text-brand-title"
                  : "border-brand-border bg-card text-brand-title hover:border-brand-accent/50"
              }`}
            >
              {o.l}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FileSlot({ label, icon: Icon, multiple, onPick }: { label: string; icon: React.ComponentType<{ className?: string }>; multiple?: boolean; onPick: (files: FileList | null) => void }) {
  return (
    <label className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-border bg-background hover:border-brand-accent/60 hover:bg-brand-soft/40 cursor-pointer h-20 px-3 text-sm text-brand-title transition-colors">
      <Icon className="h-4 w-4 text-brand-accent" />
      <span className="font-medium">{label}</span>
      <input
        type="file"
        accept="image/*,application/pdf"
        multiple={multiple}
        className="hidden"
        onChange={(e) => { onPick(e.target.files); e.target.value = ""; }}
      />
    </label>
  );
}
