'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createClientAction(formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const phone = (formData.get('phone') as string)?.trim() || null

  if (!name || !email) {
    return { error: 'Name and email are required.' }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('clients')
    .insert({ name, email, phone })

  if (error) {
    return { error: 'Failed to create client. Please try again.' }
  }

  revalidatePath('/clients')
  return { success: true }
}
