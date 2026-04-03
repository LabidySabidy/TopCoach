import { notFound } from 'next/navigation'
import {
  getSessionById,
  getSessionLogs,
  getLastCompletedSession,
  getAllExercises,
} from '@/lib/supabase/queries'
import SessionLoggingClient from './SessionLoggingClient'
import { SessionWithLogs } from '@/types'

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [sessionData, allExercises] = await Promise.all([
    getSessionById(id),
    getAllExercises(),
  ])

  if (!sessionData) notFound()

  const [existingLogs, lastSessionData] = await Promise.all([
    getSessionLogs(id),
    getLastCompletedSession(sessionData.client_id),
  ])

  const lastSession: SessionWithLogs | null = lastSessionData
    ? { session: lastSessionData.session, logs: lastSessionData.logs }
    : null

  return (
    <SessionLoggingClient
      session={sessionData as Parameters<typeof SessionLoggingClient>[0]['session']}
      allExercises={allExercises}
      existingLogs={existingLogs as Parameters<typeof SessionLoggingClient>[0]['existingLogs']}
      lastSession={lastSession}
    />
  )
}
