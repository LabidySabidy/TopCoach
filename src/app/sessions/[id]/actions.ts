'use server'

import { redirect } from 'next/navigation'
import { upsertSessionLog, completeSession } from '@/lib/supabase/queries'

export async function saveSessionLogAction(
  sessionId: string,
  exerciseId: string,
  sets: number | null,
  reps: number | null,
  weight: number | null,
  durationSeconds: number | null
) {
  await upsertSessionLog(sessionId, exerciseId, sets, reps, weight, durationSeconds)
}

export async function completeSessionAction(sessionId: string) {
  await completeSession(sessionId)
  redirect(`/sessions/${sessionId}/complete`)
}
