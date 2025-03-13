"use client"

import { useState, useEffect } from "react"
import { Bell, X, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { useDeviceDetect } from "@/hooks/use-device-detect"
import { motion, AnimatePresence } from "framer-motion"
import { subscribeUser } from "@/app/actions"

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

export function NotificationBanner() {
    const [isVisible, setIsVisible] = useState(false)
    const [showIOSInstructions, setShowIOSInstructions] = useState(false)
    const { isMobile, isIOS, isStandalone } = useDeviceDetect()

    useEffect(() => {
        // Only show on mobile and not in standalone mode
        if (isMobile && !isStandalone) {
            // Delay showing the banner for a better UX
            const timer = setTimeout(() => {
                // Check if user has already dismissed the banner
                const dismissed = localStorage.getItem("notification-banner-dismissed")
                if (!dismissed) {
                    setIsVisible(true)
                }
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [isMobile, isStandalone])

    const handleDismiss = () => {
        setIsVisible(false)
        localStorage.setItem("notification-banner-dismissed", "true")
    }

    const handleSubscribe = async () => {
        if (isIOS) {
            // iOS doesn't support web push notifications, show installation instructions
            setShowIOSInstructions(true)
        } else {
            // For other platforms, attempt to subscribe to push notifications
            if ("Notification" in window && "serviceWorker" in navigator) {
                Notification.requestPermission().then(async (permission) => {
                    if (permission === "granted") {
                        toast({
                            title: "Notifications enabled!",
                            description: "You'll now receive daily joke notifications.",
                        })
                        setIsVisible(false)

                        // Register service worker
                        const registration = await navigator.serviceWorker.ready

                        // Check if VAPID key exists
                        if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
                            console.error('VAPID public key is not defined');
                            alert('Push notification configuration is missing. Please contact support.');
                            return;
                        }

                        const sub = await registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: urlBase64ToUint8Array(
                                process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
                            ),
                        })

                        // Store subscription in state
                        // setSubscription(sub)

                        // Get serialized subscription
                        const serializedSub = JSON.parse(JSON.stringify(sub))

                        // Pass to server action
                        await subscribeUser(serializedSub)
                    } else {
                        toast({
                            title: "Notification permission denied",
                            description: "You won't receive joke notifications.",
                            variant: "destructive",
                        })
                    }
                })
            } else {
                toast({
                    title: "Notifications not supported",
                    description: "Your browser doesn't support notifications.",
                    variant: "destructive",
                })
            }
        }
    }

    if (!isVisible) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-4 left-4 right-4 z-50"
            >
                <Card className="border-primary/20 shadow-lg">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                                <Bell className="h-5 w-5 text-primary mr-2" />
                                <h3 className="font-medium">Daily Joke Notifications</h3>
                            </div>
                            <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-8 w-8">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {showIOSInstructions ? (
                            <div className="space-y-3">
                                <p className="text-sm">
                                    iOS doesn&apos;t support web notifications. Install our app to your home screen for the best experience:
                                </p>
                                <ol className="text-sm space-y-2 list-decimal pl-5">
                                    <li>
                                        Tap the share button <ExternalLink className="h-3 w-3 inline" />
                                    </li>
                                    <li>
                                        Scroll down and tap &quot;Add to Home Screen&quot; <Download className="h-3 w-3 inline" />
                                    </li>
                                    <li>Tap &quot;Add&quot; in the top right</li>
                                </ol>
                                <div className="flex justify-end mt-2">
                                    <Button variant="outline" size="sm" onClick={handleDismiss}>
                                        Got it
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-sm">Subscribe to receive a new joke every day directly to your device!</p>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm" onClick={handleDismiss}>
                                        Not now
                                    </Button>
                                    <Button size="sm" onClick={handleSubscribe}>
                                        Subscribe
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </AnimatePresence>
    )
}

