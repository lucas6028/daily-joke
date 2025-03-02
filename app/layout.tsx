import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import { JokeProvider } from "@/context/joke-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Daily Joke Hub",
  description: "Get your daily dose of laughter with our joke collection",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" sizes="any"/>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <JokeProvider>
            <div className="min-h-screen bg-background flex flex-col">
              <Header />
              <main className="flex-1 container max-w-4xl mx-auto px-4 py-6">{children}</main>
              <footer className="border-t py-4">
                <div className="container max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Daily Joke Hub. All jokes are meant for entertainment purposes.
                </div>
              </footer>
            </div>
            <Toaster />
          </JokeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

