import { Bell, ArrowLeft, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";
import { iconFor, timeAgo } from "./NotificationsBell";

export function NotificationsPage({ onBack }: { onBack: () => void }) {
  const { items, loading, unreadCount, markAsRead, markAllAsRead, remove } = useNotifications();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Button onClick={onBack} variant="outline" size="icon" className="rounded-xl">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-brand-title flex items-center gap-2">
              <Bell className="h-6 w-6 text-brand-accent" /> Toutes les notifications
            </h1>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : "Tout est à jour"}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline" className="rounded-xl gap-2">
            <Check className="h-4 w-4" /> Tout marquer comme lu
          </Button>
        )}
      </div>

      {loading ? (
        <div className="bg-card rounded-2xl border border-brand-border p-12 text-center text-muted-foreground">
          Chargement...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-card rounded-2xl border border-brand-border p-16 text-center">
          <Bell className="h-12 w-12 text-brand-accent/40 mx-auto mb-4" />
          <p className="text-brand-title font-semibold mb-1">Aucune notification</p>
          <p className="text-muted-foreground text-sm">Vous serez notifié des rappels et confirmations ici.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((n) => {
            const { Icon, color, bg } = iconFor(n.type);
            return (
              <div
                key={n.id}
                className={`group flex gap-3 p-4 rounded-2xl border transition-colors ${
                  n.read
                    ? "bg-card border-brand-border"
                    : "bg-brand-soft/40 border-brand-accent/30"
                }`}
              >
                <span className={`h-10 w-10 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-sm ${n.read ? "text-brand-title" : "font-semibold text-brand-title"}`}>
                      {n.title}
                    </p>
                    {!n.read && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-bold">
                        NOUVEAU
                      </span>
                    )}
                  </div>
                  {n.body && <p className="text-sm text-muted-foreground mt-1">{n.body}</p>}
                  <p className="text-[11px] text-muted-foreground mt-1.5">{timeAgo(n.created_at)}</p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      title="Marquer comme lu"
                      className="h-8 w-8 rounded-lg hover:bg-brand-soft text-brand-accent flex items-center justify-center transition-colors"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => remove(n.id)}
                    title="Supprimer"
                    className="h-8 w-8 rounded-lg hover:bg-rose-50 text-rose-500 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
