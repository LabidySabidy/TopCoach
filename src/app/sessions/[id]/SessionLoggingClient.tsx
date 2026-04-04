'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Exercise, Session, LastExerciseLog } from '@/types'
import ExercisePicker from './ExercisePicker'
import { saveSessionLogAction, completeSessionAction, cancelSessionAction } from './actions'

interface LogEntry {
  sets: string
  reps: string
  weight: string
  durationMin: string
  durationSec: string
}

interface Props {
  session: Session & { clients: { name: string; id: string } }
  allExercises: Exercise[]
  existingLogs: Array<{
    exercise_id: string
    sets: number | null
    reps: number | null
    weight: number | null
    duration_seconds: number | null
    exercises: Exercise
  }>
  exerciseHistory: Record<string, LastExerciseLog>
}

function secondsToMinSec(seconds: number): { min: string; sec: string } {
  return {
    min: Math.floor(seconds / 60).toString(),
    sec: (seconds % 60).toString().padStart(2, '0'),
  }
}

function formatExistingLogValue(
  log: Props['existingLogs'][0]
): string {
  const type = log.exercises.exercise_type
  if (type === 'duration') {
    if (log.duration_seconds == null) return '—'
    const { min, sec } = secondsToMinSec(log.duration_seconds)
    return sec === '00' ? `${min}m` : `${min}m ${sec}s`
  }
  const parts: string[] = []
  if (log.sets != null) parts.push(`${log.sets} sets`)
  if (log.reps != null) parts.push(`${log.reps} reps`)
  if (type === 'weighted' && log.weight != null) parts.push(`${log.weight} lbs`)
  return parts.join(' · ') || '—'
}

// ─── Read-only completed session report ──────────────────────────────────────
function CompletedSessionReport({
  session,
  logs,
}: {
  session: Props['session']
  logs: Props['existingLogs']
}) {
  const sessionDate = new Date(session.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-semibold text-gray-900">{session.clients.name}</p>
            <p className="text-xs text-gray-500">{sessionDate}</p>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700">
            Completed
          </span>
        </div>
      </div>

      <div className="flex-1 px-5 py-5 space-y-3 max-w-2xl mx-auto w-full">
        <Link
          href={`/clients/${session.clients.id}`}
          className="text-sm text-gray-500 hover:text-gray-900 transition"
        >
          ← Back to {session.clients.name}
        </Link>

        {logs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-10 text-center">
            <p className="text-sm text-gray-500">No exercises were logged in this session.</p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.exercise_id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">{log.exercises.name}</p>
                {log.exercises.muscle_group && (
                  <p className="text-xs text-gray-400 mt-0.5">{log.exercises.muscle_group}</p>
                )}
              </div>
              <p className="text-sm text-gray-600">{formatExistingLogValue(log)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ─── Resume / Cancel prompt ───────────────────────────────────────────────────
function ResumePrompt({
  session,
  logs,
  onResume,
}: {
  session: Props['session']
  logs: Props['existingLogs']
  onResume: () => void
}) {
  const [isPending, startTransition] = useTransition()

  function handleCancel() {
    startTransition(async () => {
      await cancelSessionAction(session.id, session.clients.id)
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Dimmed content preview behind the sheet */}
      <div className="flex-1 px-5 py-5 space-y-3 max-w-2xl mx-auto w-full opacity-30 pointer-events-none select-none">
        {logs.map((log) => (
          <div
            key={log.exercise_id}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4"
          >
            <p className="text-sm font-semibold text-gray-900">{log.exercises.name}</p>
            <p className="text-sm text-gray-500">{formatExistingLogValue(log)}</p>
          </div>
        ))}
      </div>

      {/* Bottom sheet */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-5 py-6 space-y-3 shadow-xl">
        <div className="mb-1">
          <p className="text-base font-semibold text-gray-900">Session in progress</p>
          <p className="text-sm text-gray-500 mt-0.5">
            {logs.length} exercise{logs.length !== 1 ? 's' : ''} logged.
            Would you like to resume or cancel this session?
          </p>
        </div>
        <button
          onClick={onResume}
          className="w-full rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 active:scale-95"
        >
          Resume Session
        </button>
        <button
          onClick={handleCancel}
          disabled={isPending}
          className="w-full rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 active:scale-95 disabled:opacity-50"
        >
          {isPending ? 'Cancelling…' : 'Cancel Session'}
        </button>
      </div>
    </div>
  )
}

// ─── Helper to format exercise history ────────────────────────────────────────
function formatExerciseHistory(history: LastExerciseLog | undefined): string {
  if (!history) return 'First time logging this exercise'

  const type = history.exercise_type
  if (type === 'duration') {
    if (history.duration_seconds == null) return 'First time logging this exercise'
    const min = Math.floor(history.duration_seconds / 60)
    const sec = history.duration_seconds % 60
    return sec === 0 ? `Last: ${min}m` : `Last: ${min}m ${sec}s`
  }

  const parts: string[] = ['Last:']
  if (history.sets != null) parts.push(`${history.sets} sets`)
  if (history.reps != null) parts.push(`${history.reps} reps`)
  if (type === 'weighted' && history.weight != null) parts.push(`${history.weight} lbs`)

  return parts.length > 1 ? parts.join(' · ') : 'First time logging this exercise'
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SessionLoggingClient({ session, allExercises, existingLogs, exerciseHistory }: Props) {
  const initialExercises = existingLogs.map((l) => l.exercises)
  const initialLogs: Record<string, LogEntry> = {}
  for (const l of existingLogs) {
    const durParts = l.duration_seconds != null ? secondsToMinSec(l.duration_seconds) : { min: '', sec: '' }
    initialLogs[l.exercise_id] = {
      sets: l.sets?.toString() ?? '',
      reps: l.reps?.toString() ?? '',
      weight: l.weight?.toString() ?? '',
      durationMin: durParts.min,
      durationSec: durParts.sec,
    }
  }

  const isCompleted = session.status === 'completed'
  const hasExistingData = existingLogs.length > 0

  const [showResumePrompt, setShowResumePrompt] = useState(!isCompleted && hasExistingData)
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises)
  const [logs, setLogs] = useState<Record<string, LogEntry>>(initialLogs)
  const [showPicker, setShowPicker] = useState(false)
  const [isPending, startTransition] = useTransition()

  // ── Completed: read-only report
  if (isCompleted) {
    return <CompletedSessionReport session={session} logs={existingLogs} />
  }

  // ── Active with existing data: resume/cancel prompt
  if (showResumePrompt) {
    return (
      <ResumePrompt
        session={session}
        logs={existingLogs}
        onResume={() => setShowResumePrompt(false)}
      />
    )
  }

  // ── Active: logging screen
  function handlePickerConfirm(selected: Exercise[]) {
    setExercises(selected)
    setShowPicker(false)
    setLogs((prev) => {
      const next = { ...prev }
      for (const ex of selected) {
        if (!next[ex.id]) {
          next[ex.id] = { sets: '', reps: '', weight: '', durationMin: '', durationSec: '' }
        }
      }
      return next
    })
  }

  function handleFieldChange(exerciseId: string, field: keyof LogEntry, value: string) {
    setLogs((prev) => ({
      ...prev,
      [exerciseId]: { ...prev[exerciseId], [field]: value },
    }))
  }

  function handleBlur(exerciseId: string) {
    const entry = logs[exerciseId]
    if (!entry) return
    const min = entry.durationMin ? parseInt(entry.durationMin) : 0
    const sec = entry.durationSec ? parseInt(entry.durationSec) : 0
    const durationSeconds = (min > 0 || sec > 0) ? min * 60 + sec : null
    startTransition(async () => {
      await saveSessionLogAction(
        session.id,
        exerciseId,
        entry.sets ? parseInt(entry.sets) : null,
        entry.reps ? parseInt(entry.reps) : null,
        entry.weight ? parseFloat(entry.weight) : null,
        durationSeconds
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
            const entry = logs[ex.id] ?? { sets: '', reps: '', weight: '', durationMin: '', durationSec: '' }
            const history = exerciseHistory[ex.id]
            return (
              <div key={ex.id} className="rounded-xl border border-gray-200 bg-white px-5 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">{ex.name}</p>
                  {ex.muscle_group && (
                    <span className="text-xs text-gray-400">{ex.muscle_group}</span>
                  )}
                </div>

                <p className="text-xs text-gray-400">{formatExerciseHistory(history)}</p>

                {ex.exercise_type === 'duration' ? (
                  <div className="grid grid-cols-2 gap-3">
                    {(['durationMin', 'durationSec'] as const).map((field) => (
                      <div key={field}>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          {field === 'durationMin' ? 'Min' : 'Sec'}
                        </label>
                        <input
                          type="number"
                          inputMode="numeric"
                          min="0"
                          max={field === 'durationSec' ? 59 : undefined}
                          value={entry[field]}
                          onChange={(e) => handleFieldChange(ex.id, field, e.target.value)}
                          onBlur={() => handleBlur(ex.id)}
                          placeholder="0"
                          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-center text-sm font-medium text-gray-900 focus:border-gray-400 focus:bg-white focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                ) : ex.exercise_type === 'bodyweight' ? (
                  <div className="grid grid-cols-2 gap-3">
                    {(['sets', 'reps'] as const).map((field) => (
                      <div key={field}>
                        <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">{field}</label>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={entry[field]}
                          onChange={(e) => handleFieldChange(ex.id, field, e.target.value)}
                          onBlur={() => handleBlur(ex.id)}
                          placeholder="—"
                          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-center text-sm font-medium text-gray-900 focus:border-gray-400 focus:bg-white focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {(['sets', 'reps', 'weight'] as const).map((field) => (
                      <div key={field}>
                        <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">
                          {field === 'weight' ? 'lbs' : field}
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
                )}
              </div>
            )
          })
        )}

        {exercises.length > 0 && (
          <button
            onClick={() => setShowPicker(true)}
            className="w-full rounded-xl border border-dashed border-gray-300 bg-white px-5 py-4 text-sm font-medium text-gray-600 transition hover:border-gray-400 hover:text-gray-900"
          >
            + Add Exercises
          </button>
        )}
      </div>

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
