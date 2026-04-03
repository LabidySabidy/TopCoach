'use client'

import { useState } from 'react'
import { Client } from '@/types'
import ClientCard from '@/components/clients/ClientCard'
import AddClientForm from '@/components/clients/AddClientForm'

export default function ClientsPageClient({ clients }: { clients: Client[] }) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-4">
      {clients.length === 0 && !showForm && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-10 text-center">
          <p className="text-sm text-gray-500">No clients yet.</p>
          <p className="text-sm text-gray-400 mt-1">Add your first client to get started.</p>
        </div>
      )}

      {clients.map((client) => (
        <ClientCard key={client.id} client={client} />
      ))}

      {showForm ? (
        <AddClientForm onSuccess={() => setShowForm(false)} />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full rounded-xl border border-dashed border-gray-300 py-4 text-sm font-medium text-gray-500 transition hover:border-gray-400 hover:text-gray-700"
        >
          + Add Client
        </button>
      )}
    </div>
  )
}
