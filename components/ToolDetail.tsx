'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Tool } from '@/types/Tool'
import { ToolSidebar } from './ToolSidebar'
import { useState } from 'react'
interface ToolDetailProps {
  tool: Tool
  allTools: Tool[]
}


export function ToolDetail({ tool, allTools }: ToolDetailProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="h-screen flex">
      {tool?.id && (<ToolSidebar tools={allTools} currentToolId={tool.id} />)}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          )}
          <iframe
            src={tool.url}
            className="w-full h-full border-none"
            title={tool.name}
            onLoad={() => setIsLoading(false)}
            allow="microphone; camera; display-capture; geolocation; autoplay; clipboard-write; clipboard-read; fullscreen; accelerometer; gyroscope; payment; midi; usb; encrypted-media; picture-in-picture"
            allowFullScreen
            referrerPolicy="no-referrer"
          />
        </main>
      </div>
    </div>
  )
}
