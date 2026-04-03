import { getClients } from '@/lib/supabase/queries'
import ClientCard from '@/components/clients/ClientCard'
import ClientsPageClient from './ClientsPageClient'

export default async function ClientsPage() {
  const clients = await getClients()

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Clients</h2>
      </div>

      <ClientsPageClient clients={clients} />
    </div>
  )
}
