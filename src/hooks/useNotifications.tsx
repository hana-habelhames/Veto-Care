import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type Notification = {
  id: string;
  user_id: string;
  type: "reminder" | "confirmation" | "new_request" | "info" | string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  related_appointment_id: string | null;
  created_at: string;
};

export function useNotifications() {
  const { user } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) { setItems([]); setLoading(false); return; }
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    setItems((data as Notification[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    setLoading(true);
    refresh();
  }, [refresh]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        () => { refresh(); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, refresh]);

  const unreadCount = items.filter((n) => !n.read).length;

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
  };

  const markAllAsRead = async () => {
    if (!user) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
  };

  const remove = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
  };

  return { items, loading, unreadCount, markAsRead, markAllAsRead, remove, refresh };
}

/* ---------- Server-side helpers (called from client at trigger time) ---------- */

export async function notifyAppointmentRequest(opts: {
  ownerId: string;
  ownerName: string;
  vetUserId: string | null; // optional — null if vet user not registered
  appointmentId: string;
  animalLabel: string;
  clinicName: string;
  date: string;
  time: string;
}) {
  const { ownerId, ownerName, vetUserId, appointmentId, animalLabel, clinicName, date, time } = opts;
  const rows: Array<Record<string, unknown>> = [];

  // Client side — confirmation that the request was placed (treated as confirmed in this demo)
  rows.push({
    user_id: ownerId,
    type: "confirmation",
    title: "Rendez-vous confirmé",
    body: `Bonne nouvelle ! Votre rendez-vous pour ${animalLabel} a été confirmé par ${clinicName}.`,
    related_appointment_id: appointmentId,
  });

  // Vet side — new request
  if (vetUserId) {
    rows.push({
      user_id: vetUserId,
      type: "new_request",
      title: "Nouvelle demande de rendez-vous",
      body: `Nouvelle demande de ${ownerName} pour le ${date} à ${time}.`,
      related_appointment_id: appointmentId,
    });
  }

  // Schedule reminder for the day before — emulated client-side: insert immediately
  // if the appointment is within 24h, otherwise it would be inserted by a cron job.
  const apptTs = new Date(`${date}T${time}`).getTime();
  const reminderTs = apptTs - 24 * 60 * 60 * 1000;
  if (reminderTs <= Date.now() && apptTs > Date.now()) {
    rows.push({
      user_id: ownerId,
      type: "reminder",
      title: "Rappel de rendez-vous",
      body: `Rappel : Votre rendez-vous avec ${clinicName} pour ${animalLabel} est prévu demain à ${time}.`,
      related_appointment_id: appointmentId,
    });
    if (vetUserId) {
      rows.push({
        user_id: vetUserId,
        type: "reminder",
        title: "Rappel de planning",
        body: `Vous avez une consultation prévue demain à ${time} avec ${ownerName} pour ${animalLabel}.`,
        related_appointment_id: appointmentId,
      });
    }
  }

  await supabase.from("notifications").insert(rows);
}
