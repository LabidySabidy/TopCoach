import { notFound } from 'next/navigation'
import {
  getSessionById,
  getSessionLogs,
  getLastLogPerExercise,
  getAllExercises,
} from '@/lib/supabase/queries'
import SessionLoggingClient from './SessionLoggingClient'

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

  const existingLogs = await getSessionLogs(id)
  const exerciseIds = existingLogs.map((log) => log.exercise_id)
  const exerciseHistory = await getLastLogPerExercise(sessionData.client_id, exerciseIds)

  return (
    <SessionLoggingClient
      session={sessionData as Parameters<typeof SessionLoggingClient>[0]['session']}
      allExercises={allExercises}
      existingLogs={existingLogs as Parameters<typeof SessionLoggingClient>[0]['existingLogs']}
      exerciseHistory={exerciseHistory}
    />
  )
}
