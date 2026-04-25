import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarPlus, Lightbulb, CheckCircle2,
  PawPrint, Stethoscope, Calendar as CalendarIcon,
  Building2, User, Settings, LogOut, Plus, MapPin, Menu, X, Clock, Phone, Heart, ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ARTICLES, type Animal, type Vet, type Article } from "./data";
import { AnimalModal } from "./AnimalModal";
import { ClinicPickerModal } from "./ClinicPickerModal";
import { ArticleModal } from "./ArticleModal";
import { AdoptionGallery } from "./AdoptionGallery";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type Section = "rdv" | "clinics" | "animals" | "profile" | "settings" | "booking" | "conseils" | "adopt";

type Appointment = {
  id: string;
  clinic_id: string;
  clinic_name: string;
  clinic_city: string | null;
  clinic_address: string | null;
  clinic_phone: string | null;
  vet_name: string | null;
  appointment_date: string;
  appointment_time: string;
  reason: string | null;
  status: string;
  animal_id: string | null;
};

type DbAnimal = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  sex: string | null;
  birth_date: string | null;
  insured: boolean | null;
  sterilized: boolean | null;
};

const NAV: { key: Section; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "rdv", label: "Mes rendez-vous", icon: CalendarIcon },
  { key: "booking", label: "Prendre RDV", icon: CalendarPlus },
  { key: "clinics", label: "Mes cliniques consultées", icon: Building2 },
  { key: "animals", label: "Mes animaux", icon: PawPrint },
  { key: "adopt", label: "Adopter un compagnon", icon: Heart },
  { key: "conseils", label: "Conseils", icon: Lightbulb },
  { key: "profile", label: "Mon profil", icon: User },
  { key: "settings", label: "Paramètres & sécurité", icon: Settings },
];

export function ClientDashboard({ onFindClinic, profileTrigger }: { onFindClinic: () => void; profileTrigger?: number }) {
  const { profile, signOut } = useAuth();
  const [section, setSection] = useState<Section>("rdv");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [animals, setAnimals] = useState<DbAnimal[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // React to header profile-icon clicks
  useEffect(() => {
    if (profileTrigger && profileTrigger > 0) setSection("profile");
  }, [profileTrigger]);

  const firstName = profile?.full_name?.split(" ")[0] || "vous";

  const refresh = async () => {
    if (!profile) return;
    const [aRes, apRes] = await Promise.all([
      supabase.from("animals").select("*").eq("owner_id", profile.id).order("created_at", { ascending: false }),
      supabase.from("appointments").select("*").eq("owner_id", profile.id).order("appointment_date", { ascending: false }),
    ]);
    setAnimals((aRes.data as DbAnimal[]) ?? []);
    setAppointments((apRes.data as Appointment[]) ?? []);
  };

  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, [profile?.id]);

  const handleLogout = async () => {
    await signOut();
    toast.success("Déconnecté");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto max-w-7xl flex">
        <aside className="hidden md:block w-64 shrink-0 border-r border-brand-border/70 bg-card min-h-[calc(100vh-4rem)] py-6 px-3 sticky top-0">
          <SidebarContent section={section} onSelect={setSection} onLogout={handleLogout} />
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
                <SidebarContent section={section} onSelect={(s) => { setSection(s); setMobileNavOpen(false); }} onLogout={handleLogout} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8">
          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              {section === "rdv" && <AppointmentsTab firstName={firstName} appointments={appointments} onFindClinic={onFindClinic} onBook={() => setSection("booking")} />}
              {section === "booking" && <BookingForm animals={animals} onBooked={() => { refresh(); setSection("rdv"); }} />}
              {section === "clinics" && <ConsultedClinics appointments={appointments} onFindClinic={onFindClinic} />}
              {section === "animals" && <AnimalsTab animals={animals} onChange={refresh} />}
              {section === "adopt" && <AdoptionGallery />}
              {section === "conseils" && <ConseilsTab />}
              {section === "profile" && <ProfileTab />}
              {section === "settings" && <SettingsTab />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ section, onSelect, onLogout }: { section: Section; onSelect: (s: Section) => void; onLogout: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = section === item.key;
        const Icon = item.icon;
        return (
          <button key={item.key} onClick={() => onSelect(item.key)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${active ? "bg-brand-soft text-brand-accent" : "text-brand-title hover:bg-brand-soft/60"}`}>
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
  );
}

/* ---------- Appointments ---------- */
function AppointmentsTab({ firstName, appointments, onFindClinic, onBook }: { firstName: string; appointments: Appointment[]; onFindClinic: () => void; onBook: () => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = appointments.filter((a) => a.appointment_date >= today);
  const past = appointments.filter((a) => a.appointment_date < today);

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-title mb-1">Bonjour, {firstName} 👋</h1>
      <p className="text-muted-foreground mb-8">Voici vos rendez-vous.</p>

      {appointments.length === 0 ? (
        <div className="bg-card rounded-xl border border-brand-border p-8 sm:p-16 flex flex-col items-center justify-center text-center min-h-[420px]">
          <div className="h-20 w-20 rounded-full bg-brand-soft flex items-center justify-center mb-6">
            <CalendarIcon className="h-10 w-10 text-brand-accent" />
          </div>
          <h2 className="text-xl font-semibold text-brand-title mb-2 max-w-md">
            Vous n'avez pas encore pris de rendez-vous dans une de nos cliniques
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md">Trouvez une clinique près de chez vous et prenez rendez-vous en quelques clics.</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <Button onClick={onBook} className="bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 rounded-xl h-12 px-6 gap-2">
              <CalendarPlus className="h-4 w-4" /> Prendre rendez-vous
            </Button>
            <Button onClick={onFindClinic} variant="outline" className="rounded-xl h-12 px-6 gap-2 border-brand-accent text-brand-accent hover:bg-brand-soft">
              <MapPin className="h-4 w-4" /> Trouver une clinique
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {upcoming.length > 0 && (
            <section>
              <h2 className="font-semibold text-brand-title mb-3">À venir ({upcoming.length})</h2>
              <div className="space-y-3">{upcoming.map((a) => <AppointmentCard key={a.id} a={a} />)}</div>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="font-semibold text-brand-title mb-3">Historique ({past.length})</h2>
              <div className="space-y-3">{past.map((a) => <AppointmentCard key={a.id} a={a} past />)}</div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function AppointmentCard({ a, past }: { a: Appointment; past?: boolean }) {
  return (
    <div className={`bg-card rounded-xl border border-brand-border p-5 ${past ? "opacity-75" : ""}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <p className="font-bold text-brand-title">{a.clinic_name}</p>
          {a.vet_name && <p className="text-sm text-muted-foreground">{a.vet_name}</p>}
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${past ? "bg-brand-soft text-brand-title" : "bg-brand-accent text-brand-accent-foreground"}`}>
          {past ? "Passé" : "Confirmé"}
        </span>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span className="flex items-center gap-1"><CalendarIcon className="h-3.5 w-3.5" /> {new Date(a.appointment_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {a.appointment_time}</span>
        {a.clinic_city && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {a.clinic_city}</span>}
      </div>
      {a.reason && <p className="text-sm text-muted-foreground mt-2 italic">« {a.reason} »</p>}
    </div>
  );
}

function ConsultedClinics({ appointments, onFindClinic }: { appointments: Appointment[]; onFindClinic: () => void }) {
  const unique = Array.from(new Map(appointments.map((a) => [a.clinic_id, a])).values());

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-title mb-6">Mes cliniques consultées</h1>
      {unique.length === 0 ? (
        <div className="bg-card rounded-xl border border-brand-border p-12 text-center">
          <Building2 className="h-12 w-12 text-brand-accent mx-auto mb-4" />
          <p className="text-brand-title font-semibold mb-2">Aucune clinique consultée pour le moment</p>
          <p className="text-muted-foreground mb-6">Vos cliniques visitées apparaîtront automatiquement ici.</p>
          <Button onClick={onFindClinic} className="bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 rounded-xl">Trouver une clinique</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {unique.map((a) => (
            <div key={a.clinic_id} className="bg-card rounded-xl border border-brand-border p-5">
              <div className="h-12 w-12 rounded-xl bg-brand-soft flex items-center justify-center mb-3">
                <Building2 className="h-6 w-6 text-brand-accent" />
              </div>
              <p className="font-bold text-brand-title">{a.clinic_name}</p>
              {a.vet_name && <p className="text-sm text-muted-foreground">{a.vet_name}</p>}
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                {a.clinic_address && <p className="flex items-start gap-1.5"><MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" /> {a.clinic_address}</p>}
                {a.clinic_phone && <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 shrink-0" /> {a.clinic_phone}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Booking ---------- */
function BookingForm({ animals, onBooked }: { animals: DbAnimal[]; onBooked: () => void }) {
  const { profile } = useAuth();
  const [animalId, setAnimalId] = useState(animals[0]?.id ?? "");
  const [clinic, setClinic] = useState<Vet | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (animals[0] && !animalId) setAnimalId(animals[0].id); }, [animals, animalId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !clinic) { toast.error("Veuillez choisir une clinique"); return; }
    setLoading(true);
    const { error } = await supabase.from("appointments").insert({
      owner_id: profile.id,
      animal_id: animalId || null,
      clinic_id: clinic.id,
      clinic_name: clinic.clinic,
      clinic_city: clinic.city,
      clinic_address: clinic.address,
      clinic_phone: clinic.phone,
      vet_name: clinic.name,
      appointment_date: date,
      appointment_time: time,
      reason,
      status: "confirmed",
    });
    setLoading(false);
    if (error) { toast.error("Erreur", { description: error.message }); return; }
    toast.success("Rendez-vous confirmé !", { description: `${clinic.clinic} le ${date} à ${time}` });
    onBooked();
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-title mb-6">Prendre rendez-vous</h1>
      <form onSubmit={submit} className="bg-card rounded-xl p-6 md:p-8 border border-brand-border space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-brand-title text-sm flex items-center gap-1.5"><PawPrint className="h-3.5 w-3.5" /> Animal *</Label>
            <select value={animalId} onChange={(e) => setAnimalId(e.target.value)} required className="w-full h-10 rounded-xl border border-brand-border bg-background px-3 text-sm text-brand-title focus:outline-none focus:ring-2 focus:ring-brand-accent/40">
              {animals.length === 0 && <option value="">Ajoutez d'abord un animal</option>}
              {animals.map((a) => (
                <option key={a.id} value={a.id}>{a.name} {a.species && `— ${a.species}`}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-brand-title text-sm flex items-center gap-1.5"><Stethoscope className="h-3.5 w-3.5" /> Clinique *</Label>
            <button type="button" onClick={() => setPickerOpen(true)} className="w-full h-10 rounded-xl border border-brand-border bg-background px-3 text-sm text-left flex items-center justify-between hover:border-brand-accent transition-colors">
              {clinic ? (
                <span className="text-brand-title truncate">{clinic.clinic} — {clinic.city}</span>
              ) : (
                <span className="text-muted-foreground">Choisir une clinique...</span>
              )}
              <Building2 className="h-4 w-4 text-brand-accent shrink-0" />
            </button>
          </div>

          <div className="space-y-1.5">
            <Label className="text-brand-title text-sm">Date *</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().slice(0, 10)} required className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-brand-title text-sm">Heure *</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className="rounded-xl" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-brand-title text-sm">Motif de la consultation *</Label>
          <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={4} required placeholder="Décrivez les symptômes ou la raison de la visite..." className="rounded-xl resize-none" />
        </div>

        <Button type="submit" disabled={loading || !clinic} size="lg" className="w-full bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 rounded-xl h-12">
          {loading ? "Envoi..." : "Confirmer le rendez-vous"}
        </Button>
      </form>

      <ClinicPickerModal open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={setClinic} />
    </div>
  );
}

/* ---------- Animals ---------- */
function AnimalsTab({ animals, onChange }: { animals: DbAnimal[]; onChange: () => void }) {
  const { profile } = useAuth();
  const [open, setOpen] = useState(false);

  const handleSave = async (a: Animal) => {
    if (!profile) return;
    const { error } = await supabase.from("animals").insert({
      owner_id: profile.id,
      name: a.name,
      species: a.species,
      breed: a.breed,
      sex: a.sex,
      birth_date: a.birthDate || null,
      insured: a.insured,
      sterilized: a.sterilized,
    });
    if (error) { toast.error("Erreur", { description: error.message }); return; }
    toast.success("Animal ajouté", { description: a.name });
    onChange();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-title">Mes animaux</h1>
        <Button onClick={() => setOpen(true)} className="bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 rounded-xl gap-2">
          <Plus className="h-4 w-4" /> Ajouter
        </Button>
      </div>

      {animals.length === 0 ? (
        <div className="bg-card rounded-xl border border-brand-border p-12 text-center">
          <PawPrint className="h-12 w-12 text-brand-accent mx-auto mb-4" />
          <p className="text-brand-title font-semibold mb-4">Aucun animal enregistré</p>
          <Button onClick={() => setOpen(true)} className="bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 rounded-xl">Ajouter un animal</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {animals.map((a) => (
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

      <AnimalModal open={open} onClose={() => setOpen(false)} onSave={handleSave} />
    </div>
  );
}

/* ---------- Conseils ---------- */
function ConseilsTab() {
  const [active, setActive] = useState<Article | null>(null);
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-title mb-2">Conseils vétérinaires</h1>
      <p className="text-muted-foreground mb-6">Articles rédigés par nos experts pour la santé de vos animaux.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ARTICLES.map((a) => (
          <button
            key={a.id}
            onClick={() => setActive(a)}
            className="text-left bg-card rounded-xl border border-brand-border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <div className="h-40 bg-brand-soft overflow-hidden">
              <img src={a.image} alt={a.title} className="w-full h-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
            <div className="p-5">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wide bg-brand-soft text-brand-accent px-2 py-0.5 rounded-full mb-2">{a.category}</span>
              <h3 className="font-bold text-brand-title mb-1.5 line-clamp-2">{a.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{a.excerpt}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {a.read}</p>
            </div>
          </button>
        ))}
      </div>

      <ArticleModal article={active} onClose={() => setActive(null)} />
    </div>
  );
}

/* ---------- Profile ---------- */
function ProfileTab() {
  const { profile, refreshProfile } = useAuth();
  const [draft, setDraft] = useState({
    full_name: profile?.full_name ?? "",
    phone: profile?.phone ?? "",
    city: profile?.city ?? "",
    address: profile?.address ?? "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDraft({
      full_name: profile?.full_name ?? "",
      phone: profile?.phone ?? "",
      city: profile?.city ?? "",
      address: profile?.address ?? "",
    });
  }, [profile]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setLoading(true);
    const { error } = await supabase.from("profiles").update(draft).eq("id", profile.id);
    setLoading(false);
    if (error) { toast.error("Erreur", { description: error.message }); return; }
    await refreshProfile();
    toast.success("Profil mis à jour");
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-title mb-6">Mon profil</h1>
      <form onSubmit={save} className="bg-card rounded-xl p-6 md:p-8 border border-brand-border space-y-5 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-brand-title text-sm">Nom complet</Label>
            <Input value={draft.full_name} onChange={(e) => setDraft({ ...draft, full_name: e.target.value })} className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-brand-title text-sm">Email</Label>
            <Input type="email" value={profile?.email ?? ""} disabled className="rounded-xl bg-brand-soft/40" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-brand-title text-sm">Téléphone</Label>
            <Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-brand-title text-sm">Ville</Label>
            <Input value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} className="rounded-xl" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-brand-title text-sm">Adresse</Label>
            <Input value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} className="rounded-xl" />
          </div>
        </div>
        <Button type="submit" disabled={loading} className="bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 rounded-xl">
          {loading ? "..." : "Enregistrer"}
        </Button>
      </form>
    </div>
  );
}

function SettingsTab() {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-title mb-6">Paramètres & sécurité</h1>
      <div className="bg-card rounded-xl p-6 md:p-8 border border-brand-border max-w-2xl">
        <p className="text-muted-foreground">Bientôt : modification du mot de passe, notifications et préférences de confidentialité.</p>
      </div>
    </div>
  );
}
