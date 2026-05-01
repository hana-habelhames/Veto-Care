import { createFileRoute, redirect } from '@tanstack/react-router'
import { ClientDashboard } from '@/components/veto/ClientDashboard'
import { supabase } from '@/integrations/supabase/client'
import { useState } from 'react'

// 1. On crée un composant intermédiaire qui va gérer les paramètres requis
function ClientPageWrapper() {
  // On recrée les états (states) dont ton dashboard a besoin
  const [profileTrigger, setProfileTrigger] = useState(0);
  const [settingsTrigger, setSettingsTrigger] = useState(0);
  const [sectionTrigger, setSectionTrigger] = useState(0);

  const handleFindClinic = () => {
    console.log("Recherche de clinique déclenchée");
    // Ta logique pour trouver une clinique ici
  };

  return (
    <ClientDashboard 
      onFindClinic={handleFindClinic}
      profileTrigger={profileTrigger}
      settingsTrigger={settingsTrigger}
      sectionTrigger={sectionTrigger as any}
    />
  )
}

// 2. On donne ce Wrapper au routeur au lieu du composant direct
export const Route = createFileRoute('/client')({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw redirect({ to: '/' })
  },
  component: ClientPageWrapper, // 👈 C'est ici que la magie opère
})