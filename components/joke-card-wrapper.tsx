"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

export default function JokeCardWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2 mb-6"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.01, duration: 0.5 }}
      >
        {children}
      </motion.div>
    </>
  )
}
