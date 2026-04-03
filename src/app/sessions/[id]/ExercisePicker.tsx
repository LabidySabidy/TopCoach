'use client'

import { useState } from 'react'
import { Exercise } from '@/types'

interface Props {
  exercises: Exercise[]
  selectedIds: string[]
  onConfirm: (selected: Exercise[]) => void
  onClose: () => void
}

export default function ExercisePicker({ exercises, selectedIds, onConfirm, onClose }: Props) {
  const [picked, setPicked] = useState<Set<string>>(new Set(selectedIds))

  const grouped = exercises.reduce<Record<string, Exercise[]>>((acc, ex) => {
    const group = ex.muscle_group ?? 'Other'
    if (!acc[group]) acc[group] = []
    acc[group].push(ex)
    return acc
  }, {})

  const groups = Object.keys(grouped).sort()

  function toggle(id: string) {
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleConfirm() {
    const selected = exercises.filter((ex) => picked.has(ex.id))
    onConfirm(selected)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <h2 className="text-base font-semibold text-gray-900">Add Exercises</h2>
        <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-900 transition">
          Cancel
        </button>
      </div>

      {/* Exercise list */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        {groups.map((group) => (
          <div key={group}>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
              {group}
            </p>
            <div className="space-y-1">
              {grouped[group].map((ex) => {
                const selected = picked.has(ex.id)
                return (
                  <button
                    key={ex.id}
                    onClick={() => toggle(ex.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition ${
                      selected
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-sm font-medium">{ex.name}</span>
                    {selected && (
                      <span className="text-xs font-semibold">✓</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-5 py-4">
        <button
          onClick={handleConfirm}
          className="w-full rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 active:scale-95"
        >
          Add {picked.size > 0 ? `${picked.size} ` : ''}Exercise{picked.size !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  )
}
