import Link from 'next/link'
import { getClientById } from '@/lib/supabase/queries'

export default async function ClientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const client = await getClientById(id)

  if (!client) {
    return (
      <div className="space-y-4">
        <Link href="/clients" className="text-sm text-gray-500 hover:text-gray-900 transition">
          ← Back to Clients
        </Link>
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-10 text-center">
          <p className="text-sm text-gray-500">Client not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link href="/clients" className="text-sm text-gray-500 hover:text-gray-900 transition">
        ← Back to Clients
      </Link>

      {/* Client Details */}
      <div className="rounded-xl border border-gray-200 bg-white px-5 py-5 space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">{client.name}</h2>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-700">Email</span>{' '}
            <a href={`mailto:${client.email}`} className="text-blue-600 hover:underline">
              {client.email}
            </a>
          </p>
          {client.phone && (
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-700">Phone</span>{' '}
              <a href={`tel:${client.phone}`} className="hover:underline">
                {client.phone}
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Sessions placeholder */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3">Sessions</h3>
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-10 text-center">
          <p className="text-sm text-gray-500">No sessions yet.</p>
        </div>
      </div>
    </div>
  )
}
