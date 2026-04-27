
DROP POLICY IF EXISTS "Authenticated users can insert notifications" ON public.notifications;

CREATE POLICY "Insert notifications for self or own appointment"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    OR (
      related_appointment_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.appointments a
        WHERE a.id = related_appointment_id
          AND a.owner_id = auth.uid()
      )
    )
  );
