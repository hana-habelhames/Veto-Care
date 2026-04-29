import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User } from "lucide-react";

export type CalendarEvent = {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  title: string;
  subtitle?: string;
  tone?: "default" | "urgent" | "done";
};

const FRENCH_DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const FRENCH_MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfWeek(d: Date) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // Monday = 0
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(d: Date, n: number) {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + n);
  return nd;
}

function startOfMonthGrid(d: Date) {
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  return startOfWeek(first);
}

const TONE: Record<NonNullable<CalendarEvent["tone"]>, string> = {
  default: "bg-brand-accent",
  urgent: "bg-rose-500",
  done: "bg-emerald-500",
};

export function VetoCalendar({ events }: { events: CalendarEvent[] }) {
  const [view, setView] = useState<"week" | "month">("week");
  const [cursor, setCursor] = useState(new Date());

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach((e) => {
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date)!.push(e);
    });
    map.forEach((list) => list.sort((a, b) => a.time.localeCompare(b.time)));
    return map;
  }, [events]);

  const weekStart = startOfWeek(cursor);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const monthStart = startOfMonthGrid(cursor);
  const monthDays = Array.from({ length: 42 }, (_, i) => addDays(monthStart, i));

  const goPrev = () => setCursor((c) => view === "week" ? addDays(c, -7) : new Date(c.getFullYear(), c.getMonth() - 1, 1));
  const goNext = () => setCursor((c) => view === "week" ? addDays(c, 7) : new Date(c.getFullYear(), c.getMonth() + 1, 1));
  const goToday = () => setCursor(new Date());

  const headerLabel = view === "week"
    ? `${weekStart.getDate()} ${FRENCH_MONTHS[weekStart.getMonth()]} – ${addDays(weekStart, 6).getDate()} ${FRENCH_MONTHS[addDays(weekStart, 6).getMonth()]} ${weekStart.getFullYear()}`
    : `${FRENCH_MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`;

  const todayStr = ymd(new Date());

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-title mb-1">Mon calendrier</h1>
      <p className="text-muted-foreground mb-6">Vue interactive de vos rendez-vous.</p>

      {/* Toolbar */}
      <div className="bg-card rounded-2xl border border-brand-border shadow-sm p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button onClick={goPrev} className="h-9 w-9 rounded-xl border border-brand-border hover:bg-brand-soft flex items-center justify-center text-brand-title">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={goNext} className="h-9 w-9 rounded-xl border border-brand-border hover:bg-brand-soft flex items-center justify-center text-brand-title">
            <ChevronRight className="h-4 w-4" />
          </button>
          <button onClick={goToday} className="h-9 px-3 rounded-xl border border-brand-border text-sm font-medium text-brand-title hover:bg-brand-soft">
            Aujourd'hui
          </button>
          <p className="ml-2 font-semibold text-brand-title capitalize">{headerLabel}</p>
        </div>
        <div className="inline-flex rounded-xl bg-brand-soft p-1">
          {(["week", "month"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 h-8 rounded-lg text-xs font-semibold transition-colors ${
                view === v ? "bg-card text-brand-accent shadow-sm" : "text-brand-title hover:bg-card/50"
              }`}
            >
              {v === "week" ? "Semaine" : "Mois"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <motion.div
        key={view + cursor.toISOString().slice(0, 10)}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-card rounded-2xl border border-brand-border shadow-sm overflow-hidden"
      >
        {view === "week" ? (
          <div className="grid grid-cols-7 divide-x divide-brand-border/60">
            {weekDays.map((d, i) => {
              const key = ymd(d);
              const dayEvents = eventsByDay.get(key) ?? [];
              const isToday = key === todayStr;
              return (
                <div key={key} className="min-h-[260px] p-3">
                  <div className={`flex items-center justify-between mb-2 ${isToday ? "text-brand-accent" : "text-brand-title"}`}>
                    <span className="text-[11px] font-semibold uppercase tracking-wide">{FRENCH_DAYS[i]}</span>
                    <span className={`h-7 w-7 rounded-full text-xs font-bold flex items-center justify-center ${isToday ? "bg-brand-accent text-brand-accent-foreground" : "text-brand-title"}`}>
                      {d.getDate()}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {dayEvents.length === 0 && <p className="text-[11px] text-muted-foreground italic">—</p>}
                    {dayEvents.map((e) => (
                      <div key={e.id} className="rounded-lg bg-brand-soft/70 border border-brand-border/40 p-2 text-left">
                        <div className="flex items-center gap-1.5">
                          <span className={`h-2 w-2 rounded-full ${TONE[e.tone ?? "default"]}`} />
                          <span className="text-[11px] font-semibold text-brand-title">{e.time}</span>
                        </div>
                        <p className="text-xs font-medium text-brand-title leading-tight mt-0.5 truncate">{e.title}</p>
                        {e.subtitle && <p className="text-[10px] text-muted-foreground truncate">{e.subtitle}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-7 bg-brand-soft/40 text-[11px] uppercase tracking-wide font-semibold text-muted-foreground">
              {FRENCH_DAYS.map((d) => <div key={d} className="px-2 py-2 text-center">{d}</div>)}
            </div>
            <div className="grid grid-cols-7">
              {monthDays.map((d) => {
                const key = ymd(d);
                const inMonth = d.getMonth() === cursor.getMonth();
                const isToday = key === todayStr;
                const dayEvents = eventsByDay.get(key) ?? [];
                return (
                  <div key={key} className={`min-h-[96px] border-t border-l border-brand-border/40 p-2 ${inMonth ? "" : "bg-brand-soft/20 text-muted-foreground"}`}>
                    <div className={`flex items-center justify-between mb-1`}>
                      <span className={`text-xs font-semibold ${isToday ? "text-brand-accent" : ""}`}>{d.getDate()}</span>
                      {dayEvents.length > 0 && (
                        <span className="text-[10px] font-bold text-brand-accent">{dayEvents.length}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {dayEvents.slice(0, 4).map((e) => (
                        <span key={e.id} title={`${e.time} ${e.title}`} className={`h-2 w-2 rounded-full ${TONE[e.tone ?? "default"]}`} />
                      ))}
                      {dayEvents.length > 4 && <span className="text-[10px] text-muted-foreground">+{dayEvents.length - 4}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-brand-accent" /> Rendez-vous</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500" /> Urgence</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Terminé</span>
      </div>
    </div>
  );
}
