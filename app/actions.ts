'use server'

import webpush from 'web-push'
import { createClient } from '@/lib/supabase/server'

// Define the custom PushSubscription type expected by web-push
interface WebPushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

// Check that both environment variables are properly configured
if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.error('Missing required VAPID keys for web push notifications')
}

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '',
  process.env.VAPID_PRIVATE_KEY ?? ''
)

export async function subscribeUser(sub: WebPushSubscription) {
  try {
    // Handle the serialized subscription from the client
    const subscription: WebPushSubscription = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth,
      },
    }

    // Store in Supabase
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('push_subscriptions')
      .upsert(
        {
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
        {
          onConflict: 'endpoint',
          ignoreDuplicates: false,
        }
      )
      .select()

    if (error) {
      console.error('Error storing subscription in database:', error)
      return { success: false, error: 'Failed to store subscription' }
    }

    return { success: true, subId: data?.[0]?.id }
  } catch (error) {
    console.error('Error during subscription:', error)
    return { success: false, error: 'Failed to process subscription' }
  }
}

export async function unsubscribeUser(endpoint: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint)

    if (error) {
      console.error('Error removing subscription from database:', error)
      return { success: false, error: 'Failed to remove subscription' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error during unsubscribe:', error)
    return { success: false, error: 'Failed to process unsubscribe request' }
  }
}
