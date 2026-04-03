import { createClient } from '@/lib/supabase/server'
import { Client, Session, SessionLog, Exercise } from '@/types'

export async function getClients(): Promise<Client[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getClientById(id: string): Promise<Client | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function createSession(clientId: string): Promise<Session> {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('sessions')
    .insert({ client_id: clientId, date: today, status: 'active' })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function completeSession(sessionId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('sessions')
    .update({ status: 'completed' })
    .eq('id', sessionId)

  if (error) throw new Error(error.message)
}

export async function getSessionById(sessionId: string): Promise<(Session & { clients: Client }) | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('sessions')
    .select('*, clients(*)')
    .eq('id', sessionId)
    .single()

  if (error) return null
  return data
}

export async function getSessionLogs(sessionId: string): Promise<(SessionLog & { exercises: Exercise })[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('session_logs')
    .select('*, exercises(*)')
    .eq('session_id', sessionId)

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getLastCompletedSession(clientId: string): Promise<{
  session: Session
  logs: (SessionLog & { exercises: Exercise })[]
} | null> {
  const supabase = await createClient()
  const { data: session, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('client_id', clientId)
    .eq('status', 'completed')
    .order('date', { ascending: false })
    .limit(1)
    .single()

  if (error || !session) return null

  const logs = await getSessionLogs(session.id)
  return { session, logs }
}

export async function getSessionsByClientId(clientId: string): Promise<Session[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('client_id', clientId)
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function upsertSessionLog(
  sessionId: string,
  exerciseId: string,
  sets: number | null,
  reps: number | null,
  weight: number | null,
  durationSeconds: number | null
): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('session_logs')
    .upsert(
      { session_id: sessionId, exercise_id: exerciseId, sets, reps, weight, duration_seconds: durationSeconds },
      { onConflict: 'session_id,exercise_id' }
    )

  if (error) throw new Error(error.message)
}

export async function updateSessionPaymentLink(sessionId: string, paymentLink: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('sessions')
    .update({ stripe_invoice_id: paymentLink })
    .eq('id', sessionId)

  if (error) throw new Error(error.message)
}

export async function deleteSession(sessionId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', sessionId)

  if (error) throw new Error(error.message)
}

export async function updateSessionCalendarEventId(sessionId: string, eventId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('sessions')
    .update({ google_calendar_event_id: eventId })
    .eq('id', sessionId)

  if (error) throw new Error(error.message)
}

export async function getAllExercises(): Promise<Exercise[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .order('muscle_group', { ascending: true })
    .order('name', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}
