import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import { JokeProvider } from "@/context/joke-context"
import { Toaster } from "@/components/ui/toaster"
import { GoogleAnalytics } from '@next/third-parties/google'
import { NotificationBanner } from "@/components/notification-banner"
import { ServiceWorkerRegistration } from "@/components/service-worker-registration"

const inter = Inter({ subsets: ["latin"] })

export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Daily Joke | 讓每天都從歡笑開始",
  description:
    "為您的生活增添一抹笑容！我們每天提供最新、最有趣的笑話，涵蓋科技、美食、雙關語等多種類型。每日更新，讓您的一天從微笑開始。",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" sizes="any" />
        {/* Open Graph meta tags */}
        <meta property="og:title" content="Daily Joke | 讓每天都從歡笑開始" />
        <meta
          property="og:description"
          content="每天一則精選笑話，帶給您歡樂與放鬆。讓您的一天從微笑開始！"
        />
        <meta property="og:image" content="/icon-512x512.png" />
        <meta property="og:url" content="https://daily-joke.vercel.app" />
        <meta property="og:type" content="website" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <JokeProvider>
            <div className="min-h-screen bg-background flex flex-col">
              <Header />
              <main className="flex-1 container max-w-4xl mx-auto px-4 py-6">{children}</main>
              <footer className="border-t py-4">
                <div className="container max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Daily Joke. All jokes are meant for entertainment purposes.
                </div>
              </footer>
            </div>
            <NotificationBanner />
            <Toaster />
            <ServiceWorkerRegistration />
          </JokeProvider>
        </ThemeProvider>
        <GoogleAnalytics gaId="G-Z9JQ13JX7T" />
      </body>
    </html>
  )
}

