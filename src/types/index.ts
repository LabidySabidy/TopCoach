export interface Client {
  id: string
  name: string
  email: string
  phone: string | null
  created_at: string
}

export interface Exercise {
  id: string
  name: string
  muscle_group: string | null
  is_custom: boolean
  created_at: string
}

export interface Session {
  id: string
  client_id: string
  date: string
  time: string | null
  notes: string | null
  status: 'active' | 'completed'
  google_calendar_event_id: string | null
  stripe_invoice_id: string | null
  created_at: string
}

export interface SessionWithLogs {
  session: Session
  logs: Array<SessionLog & { exercises: Exercise }>
}

export interface SessionLog {
  id: string
  session_id: string
  exercise_id: string
  sets: number | null
  reps: number | null
  weight: number | null
  notes: string | null
  created_at: string
}
