import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Clock, CheckCircle2, CalendarPlus, Info, X } from "lucide-react";
import { useNotifications, type Notification } from "@/hooks/useNotifications";

function iconFor(type: string) {
  switch (type) {
    case "reminder": return { Icon: Clock, color: "text-sky-600", bg: "bg-sky-50" };
    case "confirmation": return { Icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" };
    case "new_request": return { Icon: CalendarPlus, color: "text-emerald-600", bg: "bg-emerald-50" };
    default: return { Icon: Info, color: "text-slate-600", bg: "bg-slate-100" };
  }
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  return `il y a ${Math.floor(diff / 86400)} j`;
}

export function NotificationsBell({ onSeeAll }: { onSeeAll: () => void }) {
  const { items, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const top5 = items.slice(0, 5);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        className="relative h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-slate-800">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-[360px] max-w-[calc(100vw-2rem)] bg-card text-foreground rounded-2xl shadow-2xl border border-brand-border overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-brand-border/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-brand-accent" />
                <p className="font-semibold text-brand-title text-sm">Notifications</p>
                {unreadCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 font-semibold">
                    {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-[11px] text-brand-accent hover:underline font-medium">
                  Tout marquer lu
                </button>
              )}
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {top5.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  Aucune notification pour le moment.
                </div>
              ) : (
                top5.map((n) => <NotifRow key={n.id} n={n} onClick={() => { markAsRead(n.id); }} />)
              )}
            </div>

            <button
              onClick={() => { setOpen(false); onSeeAll(); }}
              className="w-full px-4 py-3 text-sm font-semibold text-brand-accent hover:bg-brand-soft border-t border-brand-border/60 transition-colors"
            >
              Voir tout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NotifRow({ n, onClick }: { n: Notification; onClick: () => void }) {
  const { Icon, color, bg } = iconFor(n.type);
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 flex gap-3 hover:bg-brand-soft/50 transition-colors border-b border-brand-border/40 last:border-b-0 ${
        n.read ? "" : "bg-brand-soft/30"
      }`}
    >
      <span className={`h-9 w-9 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0`}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={`text-sm truncate ${n.read ? "text-brand-title" : "font-semibold text-brand-title"}`}>
            {n.title}
          </p>
          {!n.read && <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />}
        </div>
        {n.body && <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.body}</p>}
        <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(n.created_at)}</p>
      </div>
    </button>
  );
}

export { iconFor, timeAgo };
