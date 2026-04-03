'use server'

import { getCalendar } from '@/lib/google-calendar'
import { getStripe } from '@/lib/stripe'
import { updateSessionCalendarEventId, updateSessionPaymentLink, getSessionById } from '@/lib/supabase/queries'

export async function scheduleNextSessionAction(
  sessionId: string,
  clientName: string,
  clientEmail: string,
  dateTimeISO: string
): Promise<{ success: true; eventId: string } | { success: false; error: string }> {
  try {
    const calendar = getCalendar()
    const startTime = new Date(dateTimeISO)
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // +1 hour

    const event = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: `Training Session — ${clientName}`,
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: endTime.toISOString() },
        attendees: [{ email: clientEmail }],
      },
    })

    const eventId = event.data.id!
    await updateSessionCalendarEventId(sessionId, eventId)
    return { success: true, eventId }
  } catch {
    return { success: false, error: 'Calendar invite failed — send manually.' }
  }
}

export async function sendPaymentAction(
  sessionId: string,
  clientEmail: string,
  tipCents: number
): Promise<{ success: true; paymentLink: string } | { success: false; error: string }> {
  try {
    const stripe = getStripe()
    const sessionPriceCents = parseInt(process.env.SESSION_PRICE ?? '75') * 100
    const totalCents = sessionPriceCents + tipCents

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'Training Session' },
            unit_amount: totalCents,
          },
          quantity: 1,
        },
      ],
    })

    await updateSessionPaymentLink(sessionId, paymentLink.url)
    return { success: true, paymentLink: paymentLink.url }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate payment link.'
    return { success: false, error: message }
  }
}

export async function getSessionClientAction(sessionId: string) {
  const session = await getSessionById(sessionId)
  return session
}
