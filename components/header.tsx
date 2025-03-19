"use client"

import Link from "next/link"
import Image from "next/image"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Home, List, Shuffle } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Header() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Random",
      href: "/random",
      icon: Shuffle,
    },
    {
      name: "Categories",
      href: "/categories",
      icon: List,
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-4xl mx-auto flex h-14 items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-2xl">
            <Link key="home" href="/">
              <Image src="/favicon.svg" alt="daily-joke logo" width={30} height={30} className="inline-block" />
            </Link>
          </span>
          <span className="hidden sm:inline-block">Daily Joke</span>
        </div>

        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

            return (
              <Link key={item.name} href={item.href}>
                <Button variant={isActive ? "secondary" : "ghost"} size="sm" className="gap-2">
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline-block">{item.name}</span>
                </Button>
              </Link>
            )
          })}
          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}

