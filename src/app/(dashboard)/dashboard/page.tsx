import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Welcome to TopCoach</h2>
      <p className="text-sm text-gray-500">What would you like to do?</p>
      <div className="grid gap-3">
        <Link
          href="/dashboard/clients"
          className="block rounded-xl border border-gray-200 bg-white px-5 py-4 transition hover:border-gray-300 hover:shadow-sm"
        >
          <p className="text-base font-semibold text-gray-900">Clients</p>
          <p className="text-sm text-gray-500 mt-0.5">View and manage your client roster</p>
        </Link>
      </div>
    </div>
  )
}
