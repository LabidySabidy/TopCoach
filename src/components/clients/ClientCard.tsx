import Link from 'next/link'
import { Client } from '@/types'

export default function ClientCard({ client }: { client: Client }) {
  return (
    <Link
      href={`/dashboard/clients/${client.id}`}
      className="block w-full rounded-xl border border-gray-200 bg-white px-5 py-4 transition hover:border-gray-300 hover:shadow-sm active:bg-gray-50"
    >
      <p className="text-base font-semibold text-gray-900">{client.name}</p>
      <p className="text-sm text-gray-500 mt-0.5">{client.email}</p>
      {client.phone && (
        <p className="text-sm text-gray-400 mt-0.5">{client.phone}</p>
      )}
    </Link>
  )
}
