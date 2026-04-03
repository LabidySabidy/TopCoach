import Link from 'next/link'
import { getClientById, getSessionsByClientId } from '@/lib/supabase/queries'
import { startSessionAction } from '../actions'

export default async function ClientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [client, sessions] = await Promise.all([
    getClientById(id),
    getSessionsByClientId(id),
  ])

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

  const startSession = startSessionAction.bind(null, client.id)

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
        <form action={startSession}>
          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 active:scale-95"
          >
            Start Session
          </button>
        </form>
      </div>

      {/* Sessions list */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3">Sessions</h3>
        {sessions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-10 text-center">
            <p className="text-sm text-gray-500">No sessions logged yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4"
              >
                <p className="text-sm font-medium text-gray-900">
                  {new Date(session.date + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    session.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {session.status === 'completed' ? 'Completed' : 'Active'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
