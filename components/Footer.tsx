'use client'

import { Github } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
      <Link
        href="https://github.com/mereithhh/van-hub"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <Github className="w-4 h-4" />
        <span className="text-sm">van-hub</span>
      </Link>
    </footer>
  )
} 