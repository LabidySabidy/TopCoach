'use client'

import { useState, useEffect, useTransition } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { scheduleNextSessionAction, sendPaymentAction, sendPaymentEmailAction, getSessionClientAction } from './actions'

type Step = 'schedule' | 'payment'

interface SessionClient {
  id: string
  client_id: string
  clients: { id: string; name: string; email: string }
}

export default function CompleteSessionClient({ sessionPrice }: { sessionPrice: number }) {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.id as string

  const [step, setStep] = useState<Step>('schedule')
  const [sessionData, setSessionData] = useState<SessionClient | null>(null)
  const [isPending, startTransition] = useTransition()

  // Schedule step
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('10:00')
  const [scheduleError, setScheduleError] = useState<string | null>(null)
  const [scheduleSuccess, setScheduleSuccess] = useState(false)

  // Payment step
  const [tipDollars, setTipDollars] = useState('')
  const [paymentLink, setPaymentLink] = useState<string | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  useEffect(() => {
    getSessionClientAction(sessionId).then((data) => {
      setSessionData(data as SessionClient | null)
    })
  }, [sessionId])

  function goToPayment() {
    setStep('payment')
  }

  function goToDone() {
    if (!sessionData) {
      router.push('/clients')
      return
    }
    router.push(`/clients/${sessionData.client_id}`)
  }

  function handleSchedule() {
    if (!scheduleDate || !sessionData) return
    setScheduleError(null)

    const dateTimeISO = new Date(`${scheduleDate}T${scheduleTime}:00`).toISOString()

    startTransition(async () => {
      const result = await scheduleNextSessionAction(
        sessionId,
        sessionData.clients.name,
        sessionData.clients.email,
        dateTimeISO
      )
      if (result.success) {
        setScheduleSuccess(true)
        setTimeout(goToPayment, 1000)
      } else {
        setScheduleError(result.error)
      }
    })
  }

  function handleGeneratePayment() {
    if (!sessionData) return
    setPaymentError(null)

    const tipCents = tipDollars ? Math.round(parseFloat(tipDollars) * 100) : 0

    startTransition(async () => {
      const result = await sendPaymentAction(sessionId, sessionData.clients.email, tipCents)
      if (result.success) {
        setPaymentLink(result.paymentLink)
      } else {
        setPaymentError(result.error)
      }
    })
  }

  function handleSendEmail() {
    if (!paymentLink || !sessionData) return
    setEmailError(null)
    startTransition(async () => {
      const result = await sendPaymentEmailAction(
        sessionData.clients.name,
        sessionData.clients.email,
        paymentLink
      )
      if (result.success) {
        setEmailSent(true)
      } else {
        setEmailError(result.error)
      }
    })
  }

  if (!sessionData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-5 py-4">
        <p className="text-base font-semibold text-gray-900">Session Complete</p>
        <p className="text-xs text-gray-500">{sessionData.clients.name}</p>
      </div>

      <div className="flex-1 px-5 py-8 max-w-lg mx-auto w-full space-y-6">
        {/* Step indicators */}
        <div className="flex items-center gap-2">
          {(['schedule', 'payment'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                  step === s
                    ? 'bg-gray-900 text-white'
                    : step === 'payment' && s === 'schedule'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step === 'payment' && s === 'schedule' ? '✓' : i + 1}
              </div>
              <span className={`text-xs ${step === s ? 'font-medium text-gray-900' : 'text-gray-400'}`}>
                {s === 'schedule' ? 'Schedule' : 'Payment'}
              </span>
              {i === 0 && <div className="h-px w-6 bg-gray-200" />}
            </div>
          ))}
        </div>

        {/* Step 1: Schedule */}
        {step === 'schedule' && (
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-6 space-y-5">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Schedule next session?</h2>
              <p className="text-sm text-gray-500 mt-1">
                A Google Calendar invite will be sent to {sessionData.clients.email}.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-gray-400 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Time</label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-gray-400 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {scheduleError && (
              <div className="rounded-lg bg-red-50 px-4 py-3">
                <p className="text-sm text-red-700">{scheduleError}</p>
                <p className="text-xs text-red-500 mt-1">
                  Session: {scheduleDate} at {scheduleTime}
                </p>
                <button
                  onClick={goToPayment}
                  className="mt-2 text-xs font-medium text-red-700 underline"
                >
                  Continue anyway →
                </button>
              </div>
            )}

            {scheduleSuccess && (
              <div className="rounded-lg bg-green-50 px-4 py-3">
                <p className="text-sm text-green-700">Calendar invite sent!</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={goToPayment}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:text-gray-900"
              >
                Skip
              </button>
              <button
                onClick={handleSchedule}
                disabled={isPending || !scheduleDate || scheduleSuccess}
                className="flex-1 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 active:scale-95 disabled:opacity-50"
              >
                {isPending ? 'Scheduling…' : 'Schedule'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 'payment' && (
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-6 space-y-5">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Send payment?</h2>
              <p className="text-sm text-gray-500 mt-1">
                Generate a Stripe Payment Link for this session.
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">Session price</span>
              <span className="text-sm font-semibold text-gray-900">${sessionPrice}</span>
            </div>

            {!paymentLink && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Tip (optional, $)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="1"
                  value={tipDollars}
                  onChange={(e) => setTipDollars(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-gray-400 focus:bg-white focus:outline-none"
                />
                {tipDollars && parseFloat(tipDollars) > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Total: ${sessionPrice + parseFloat(tipDollars)}
                  </p>
                )}
              </div>
            )}

            {paymentError && (
              <div className="rounded-lg bg-red-50 px-4 py-3">
                <p className="text-sm text-red-700">{paymentError}</p>
              </div>
            )}

            {paymentLink && (
              <div className="space-y-3">
                <div className="rounded-lg bg-green-50 px-4 py-3">
                  <p className="text-xs text-green-600 mb-1">Payment link ready</p>
                  <a
                    href={paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm font-medium text-green-800 break-all underline"
                  >
                    {paymentLink}
                  </a>
                </div>
                {emailError && (
                  <p className="text-xs text-red-600">{emailError}</p>
                )}
                <button
                  onClick={handleSendEmail}
                  disabled={isPending || emailSent}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:text-gray-900 disabled:opacity-50"
                >
                  {emailSent ? 'Email sent ✓' : isPending ? 'Sending…' : 'Send to email →'}
                </button>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={goToDone}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:text-gray-900"
              >
                {paymentLink ? 'Done' : 'Skip'}
              </button>
              {!paymentLink && (
                <button
                  onClick={handleGeneratePayment}
                  disabled={isPending}
                  className="flex-1 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 active:scale-95 disabled:opacity-50"
                >
                  {isPending ? 'Generating…' : 'Generate Link'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
