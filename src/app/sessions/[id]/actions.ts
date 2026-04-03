'use server'

import { redirect } from 'next/navigation'
import { upsertSessionLog, completeSession, deleteSession } from '@/lib/supabase/queries'

export async function saveSessionLogAction(
  sessionId: string,
  exerciseId: string,
  sets: number | null,
  reps: number | null,
  weight: number | null,
  durationSeconds: number | null
): Promise<{ error?: string }> {
  try {
    await upsertSessionLog(sessionId, exerciseId, sets, reps, weight, durationSeconds)
    return {}
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to save' }
  }
}

export async function completeSessionAction(sessionId: string) {
  await completeSession(sessionId)
  redirect(`/sessions/${sessionId}/complete`)
}

export async function cancelSessionAction(sessionId: string, clientId: string) {
  await deleteSession(sessionId)
  redirect(`/clients/${clientId}`)
}
