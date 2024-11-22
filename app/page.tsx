'use client'
import ClientSideContent from '@/components/ClientSideContent'
import { Tool } from '@/types/Tool'
import db from '@/lib/db'
import Link from 'next/link'
import Title from '@/components/Title'
import { useState, useEffect } from 'react'
import { Footer } from '@/components/Footer'


export default function Home() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch('/api/tools')
        const data = await response.json()
        setTools(data)
      } finally {
        setLoading(false)
      }
    }
    fetchTools()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="absolute top-4 right-4">
        <Link
          href="/admin/tools"
          className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-md transition-colors"
        >
          后台管理
        </Link>
      </div>

      <Title />

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <ClientSideContent initialTools={tools} />
      )}

      <Footer />
    </div>
  )
}


