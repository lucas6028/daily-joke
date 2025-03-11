'use server'

import webpush from 'web-push'

// Utility function to convert ArrayBuffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return Buffer.from(buffer).toString('base64')
}

// Define the custom PushSubscription type expected by web-push
interface WebPushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

let subscription: WebPushSubscription | null = null

export async function subscribeUser(sub: PushSubscription) {
  const p256dh = sub.getKey('p256dh')
  const auth = sub.getKey('auth')

  if (!p256dh || !auth) {
    throw new Error('Invalid subscription: missing p256dh or auth keys')
  }

  // Convert ArrayBuffer to base64 strings
  subscription = {
    endpoint: sub.endpoint,
    keys: {
      p256dh: arrayBufferToBase64(p256dh),
      auth: arrayBufferToBase64(auth),
    },
  }

  // In a production environment, you would want to store the subscription in a database
  // For example: await db.subscriptions.create({ data: subscription })
  return { success: true }
}

export async function unsubscribeUser() {
  subscription = null
  // In a production environment, you would want to remove the subscription from the database
  // For example: await db.subscriptions.delete({ where: { ... } })
  return { success: true }
}

export async function sendNotification(message: string) {
  if (!subscription) {
    throw new Error('No subscription available')
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Test Notification',
        body: message,
        icon: '/icon-background.jpeg',
      })
    )
    return { success: true }
  } catch (error) {
    console.error('Error sending push notification:', error)
    return { success: false, error: 'Failed to send notification' }
  }
}
