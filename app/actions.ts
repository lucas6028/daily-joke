"use server";

import webpush from "web-push";

// Utility function to convert ArrayBuffer to base64
// function arrayBufferToBase64(buffer: ArrayBuffer): string {
//   return Buffer.from(buffer).toString("base64");
// }

// Define the custom PushSubscription type expected by web-push
interface WebPushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// Check that both environment variables are properly configured
if (
  !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  !process.env.VAPID_PRIVATE_KEY
) {
  console.error("Missing required VAPID keys for web push notifications");
}

webpush.setVapidDetails(
  "mailto:your-email@example.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || ""
);

// Instead of using an in-memory variable, we'll use an object to simulate storage
// In a real app, you'd use a database instead
let subscriptionStore: Record<string, WebPushSubscription> = {};

export async function subscribeUser(sub: WebPushSubscription) {
  try {
    // Handle the serialized subscription from the client
    const subscription: WebPushSubscription = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth,
      },
    };

    // Store using endpoint as a key
    const subId = Buffer.from(subscription.endpoint).toString("base64");
    subscriptionStore[subId] = subscription;

    // In production, store in a database instead
    return { success: true, subId };
  } catch (error) {
    console.error("Error during subscription:", error);
    return { success: false, error: "Failed to process subscription" };
  }
}

export async function unsubscribeUser() {
  // Clear all subscriptions for simplicity
  subscriptionStore = {};
  return { success: true };
}

export async function sendNotification(message: string) {
  try {
    // If no subscriptions, return early
    const subscriptions = Object.values(subscriptionStore);
    if (subscriptions.length === 0) {
      return { success: false, error: "No subscriptions available" };
    }

    // Send to all stored subscriptions (in this example just one)
    for (const subscription of subscriptions) {
      await webpush.sendNotification(
        subscription,
        JSON.stringify({
          title: "Test Notification",
          body: message,
          icon: "/icon-background.jpeg",
        })
      );
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Error sending push notification:", error);
    // Return more detailed error for debugging
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: "Failed to send notification",
      details: errorMessage,
    };
  }
}
