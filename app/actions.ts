"use server";

import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

    // Store in Supabase
    const { data, error } = await supabase
      .from("push_subscriptions")
      .upsert(
        {
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
        {
          onConflict: "endpoint",
          ignoreDuplicates: false,
        }
      )
      .select();

    if (error) {
      console.error("Error storing subscription in database:", error);
      return { success: false, error: "Failed to store subscription" };
    }

    return { success: true, subId: data?.[0]?.id };
  } catch (error) {
    console.error("Error during subscription:", error);
    return { success: false, error: "Failed to process subscription" };
  }
}

export async function unsubscribeUser(endpoint: string) {
  try {
    const { error } = await supabase
      .from("push_subscriptions")
      .delete()
      .eq("endpoint", endpoint);

    if (error) {
      console.error("Error removing subscription from database:", error);
      return { success: false, error: "Failed to remove subscription" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error during unsubscribe:", error);
    return { success: false, error: "Failed to process unsubscribe request" };
  }
}

export async function sendNotification(message: string) {
  try {
    // Fetch all subscriptions from Supabase
    const { data: subscriptionsData, error } = await supabase
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth");

    if (error) {
      console.error("Error fetching subscriptions:", error);
      return { success: false, error: "Failed to fetch subscriptions" };
    }

    if (!subscriptionsData || subscriptionsData.length === 0) {
      return { success: false, error: "No subscriptions available" };
    }

    // Convert Supabase records to WebPushSubscription format
    const subscriptions: WebPushSubscription[] = subscriptionsData.map(
      (sub) => ({
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      })
    );

    // Send notifications to all subscriptions
    const results = await Promise.allSettled(
      subscriptions.map((subscription) =>
        webpush.sendNotification(
          subscription,
          JSON.stringify({
            title: "Test Notification",
            body: message,
            icon: "/icon-512x512.png",
          })
        )
      )
    );

    // Check if any notifications were sent successfully
    const anySuccess = results.some((result) => result.status === "fulfilled");
    if (!anySuccess) {
      return { success: false, error: "Failed to send any notifications" };
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
