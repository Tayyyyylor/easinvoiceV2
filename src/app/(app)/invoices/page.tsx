import { Invoices } from '@/components/pages/Invoices'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function InvoicesPage() {
   const supabase = await createClient()
       const {
           data: { user },
       } = await supabase.auth.getUser()
       if (!user) redirect('/login')
   
       const { data: invoices, error } = await supabase
           .from('invoices')
           .select('*')
           .eq('owner_id', user.id)
           .order('created_at', { ascending: false })
   
       if (error) {
           console.error('fetch quotes error', error)
       }
   
       return <Invoices invoices={invoices ?? []} />
}
