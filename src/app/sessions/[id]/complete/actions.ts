'use server'

import { google } from 'googleapis'
import { getCalendar } from '@/lib/google-calendar'
import { getStripe } from '@/lib/stripe'
import { updateSessionCalendarEventId, updateSessionPaymentLink, getSessionById } from '@/lib/supabase/queries'

function getGmailClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )
  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN })
  return google.gmail({ version: 'v1', auth: oauth2Client })
}

function buildRawEmail(to: string, subject: string, body: string): string {
  const lines = [
    `To: ${to}`,
    'Content-Type: text/plain; charset=utf-8',
    `Subject: ${subject}`,
    '',
    body,
  ]
  return Buffer.from(lines.join('\r\n'))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

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
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { success: false, error: `Calendar error: ${message}` }
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

export async function sendPaymentEmailAction(
  clientName: string,
  clientEmail: string,
  paymentLink: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const gmail = getGmailClient()
    const subject = 'Payment for your training session'
    const body = `Hi ${clientName},\n\nHere's your payment link for today's session:\n\n${paymentLink}\n\nThank you!`
    const raw = buildRawEmail(clientEmail, subject, body)
    await gmail.users.messages.send({ userId: 'me', requestBody: { raw } })
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to send email.'
    return { success: false, error: message }
  }
}

export async function getSessionClientAction(sessionId: string) {
  const session = await getSessionById(sessionId)
  return session
}
