'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, List, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
    },
    {
      name: 'Categories',
      href: '/categories',
      icon: List,
    },
    {
      name: 'Favorites',
      href: '/favorites',
      icon: Heart,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

          return (
            <Link key={item.name} href={item.href} className="w-full">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="relative">
                  <item.icon className={`h-6 w-6 ${isActive ? 'text-primary' : 'text-gray-500'}`} />
                  {isActive && (
                    <motion.div
                      layoutId="navigation-underline"
                      className="absolute -bottom-2 left-0 right-0 h-1 bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
                <span
                  className={`text-xs mt-1 ${isActive ? 'text-primary font-medium' : 'text-gray-500'}`}
                >
                  {item.name}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
