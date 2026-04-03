'use client'

import { useState, useTransition } from 'react'
import { Exercise, Session, SessionWithLogs } from '@/types'
import ExercisePicker from './ExercisePicker'
import { saveSessionLogAction, completeSessionAction } from './actions'

interface LogEntry {
  exerciseId: string
  sets: string
  reps: string
  weight: string
}

interface Props {
  session: Session & { clients: { name: string; id: string } }
  allExercises: Exercise[]
  existingLogs: Array<{ exercise_id: string; sets: number | null; reps: number | null; weight: number | null; exercises: Exercise }>
  lastSession: SessionWithLogs | null
}

export default function SessionLoggingClient({ session, allExercises, existingLogs, lastSession }: Props) {
  const initialExercises = existingLogs.map((l) => l.exercises)
  const initialLogs: Record<string, LogEntry> = {}
  for (const l of existingLogs) {
    initialLogs[l.exercise_id] = {
      exerciseId: l.exercise_id,
      sets: l.sets?.toString() ?? '',
      reps: l.reps?.toString() ?? '',
      weight: l.weight?.toString() ?? '',
    }
  }

  const [exercises, setExercises] = useState<Exercise[]>(initialExercises)
  const [logs, setLogs] = useState<Record<string, LogEntry>>(initialLogs)
  const [showPicker, setShowPicker] = useState(false)
  const [showLastSession, setShowLastSession] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handlePickerConfirm(selected: Exercise[]) {
    setExercises(selected)
    setShowPicker(false)
    // Init log entries for new exercises
    setLogs((prev) => {
      const next = { ...prev }
      for (const ex of selected) {
        if (!next[ex.id]) {
          next[ex.id] = { exerciseId: ex.id, sets: '', reps: '', weight: '' }
        }
      }
      return next
    })
  }

  function handleFieldChange(exerciseId: string, field: 'sets' | 'reps' | 'weight', value: string) {
    setLogs((prev) => ({
      ...prev,
      [exerciseId]: { ...prev[exerciseId], [field]: value },
    }))
  }

  function handleBlur(exerciseId: string) {
    const entry = logs[exerciseId]
    if (!entry) return
    startTransition(async () => {
      await saveSessionLogAction(
        session.id,
        exerciseId,
        entry.sets ? parseInt(entry.sets) : null,
        entry.reps ? parseInt(entry.reps) : null,
        entry.weight ? parseFloat(entry.weight) : null
      )
    })
  }

  function handleComplete() {
    startTransition(async () => {
      await completeSessionAction(session.id)
    })
  }

  const sessionDate = new Date(session.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-semibold text-gray-900">{session.clients.name}</p>
            <p className="text-xs text-gray-500">{sessionDate}</p>
          </div>
          <button
            onClick={handleComplete}
            disabled={isPending}
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 active:scale-95 disabled:opacity-50"
          >
            {isPending ? 'Saving…' : 'Complete Session'}
          </button>
        </div>
      </div>

      <div className="flex-1 px-5 py-5 space-y-4 max-w-2xl mx-auto w-full">
        {/* Last session reference toggle */}
        {lastSession && (
          <button
            onClick={() => setShowLastSession((v) => !v)}
            className="w-full text-left rounded-xl border border-gray-200 bg-white px-5 py-3 transition hover:border-gray-300"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">
                Last session:{' '}
                {new Date(lastSession.session.date + 'T00:00:00').toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <span className="text-xs text-gray-400">{showLastSession ? '▲ hide' : '▼ show'}</span>
            </div>

            {showLastSession && (
              <div className="mt-3 space-y-2">
                {lastSession.logs.length === 0 ? (
                  <p className="text-xs text-gray-400">No exercises logged.</p>
                ) : (
                  lastSession.logs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between">
                      <p className="text-xs text-gray-700">{log.exercises.name}</p>
                      <p className="text-xs text-gray-500">
                        {[
                          log.sets != null ? `${log.sets} sets` : null,
                          log.reps != null ? `${log.reps} reps` : null,
                          log.weight != null ? `${log.weight} lbs` : null,
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </button>
        )}

        {!lastSession && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-3 text-center">
            <p className="text-xs text-gray-400">First session for this client</p>
          </div>
        )}

        {/* Exercise cards */}
        {exercises.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-10 text-center">
            <p className="text-sm text-gray-500 mb-3">No exercises added yet.</p>
            <button
              onClick={() => setShowPicker(true)}
              className="text-sm font-medium text-gray-900 underline"
            >
              Add exercises
            </button>
          </div>
        ) : (
          exercises.map((ex) => {
            const entry = logs[ex.id] ?? { sets: '', reps: '', weight: '' }
            return (
              <div key={ex.id} className="rounded-xl border border-gray-200 bg-white px-5 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">{ex.name}</p>
                  {ex.muscle_group && (
                    <span className="text-xs text-gray-400">{ex.muscle_group}</span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {(['sets', 'reps', 'weight'] as const).map((field) => (
                    <div key={field}>
                      <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">
                        {field === 'weight' ? 'Weight (lbs)' : field}
                      </label>
                      <input
                        type="number"
                        inputMode="decimal"
                        value={entry[field]}
                        onChange={(e) => handleFieldChange(ex.id, field, e.target.value)}
                        onBlur={() => handleBlur(ex.id)}
                        placeholder="—"
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-center text-sm font-medium text-gray-900 focus:border-gray-400 focus:bg-white focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        )}

        {/* Add exercises button */}
        {exercises.length > 0 && (
          <button
            onClick={() => setShowPicker(true)}
            className="w-full rounded-xl border border-dashed border-gray-300 bg-white px-5 py-4 text-sm font-medium text-gray-600 transition hover:border-gray-400 hover:text-gray-900"
          >
            + Add Exercises
          </button>
        )}
      </div>

      {/* Exercise picker sheet */}
      {showPicker && (
        <ExercisePicker
          exercises={allExercises}
          selectedIds={exercises.map((e) => e.id)}
          onConfirm={handlePickerConfirm}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  )
}
