'use client'

import { useState, useEffect } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { ToolList } from '@/components/ToolList'
import { Tool } from '@/types/Tool'

interface ClientSideContentProps {
  initialTools: Tool[]
}

export default function ClientSideContent({ initialTools }: ClientSideContentProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [tools] = useState<Tool[]>(initialTools)

  const filteredTools = tools.filter(tool =>
    (tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!selectedTag || tool.tags.includes(selectedTag))
  )

  const allTags = Array.from(new Set(tools.flatMap(tool => tool.tags)))

  return (
    <>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">标签:</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-2 py-1 rounded-md text-sm ${selectedTag === null
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
          >
            全部
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-2 py-1 rounded-md text-sm ${selectedTag === tag
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      <ToolList tools={filteredTools} />
    </>
  )
}
