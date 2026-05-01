import { createFileRoute, redirect } from '@tanstack/react-router'
import { VetoDashboard } from '@/components/veto/VetoDashboard'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/veto')({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw redirect({ to: '/' })
  },
  component: VetoDashboard,
})
