'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function submitMatchmakingRequest(item_type: string, action_type: string, volume: number) {
  const supabase = await createClient()

  // 1. Get the current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'You must be logged in to submit a request.' }
  }

  // 2. Call the RPC function for atomic matchmaking and duplicate prevention
  const { data, error } = await supabase.rpc('process_matchmaking', {
    p_user_id: user.id,
    p_item_type: item_type,
    p_action_type: action_type,
    p_volume: volume,
  })

  if (error) {
    // Check if it's our custom duplicate error
    if (error.message.includes('Data ini sudah ditambahkan sebelumnya')) {
      return { error: 'Data ini sudah ditambahkan sebelumnya' }
    }
    console.error('Matchmaking error:', error)
    return { error: 'An error occurred during matchmaking. Please try again.' }
  }

  // 3. Revalidate the dashboard path to trigger an optimistic update
  revalidatePath('/dashboard')

  return { success: true, data }
}

export async function submitDirectMatch(partner_id: string, item_type: string, volume: number) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'You must be logged in to submit a request.' }
  }

  // Insert request
  const { data: reqData, error: reqErr } = await supabase.from('requests').insert({
      user_id: user.id,
      item_type: item_type,
      action_type: 'OFFER',
      volume: volume,
      status: 'MATCHED'
  }).select('id').single();

  if (reqErr) {
      console.error("Direct Match Req Error:", reqErr);
      return { error: reqErr.message || JSON.stringify(reqErr) }
  }

  // Insert match
  const { error: matchErr } = await supabase.from('matches').insert({
      request_id: reqData.id,
      partner_id: partner_id
  });

  if (matchErr) {
      console.error("Direct Match Err:", matchErr);
      return { error: matchErr.message || JSON.stringify(matchErr) }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
