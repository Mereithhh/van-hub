'use client'

import { ChangeEvent, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export function SearchBar({ searchTerm, setSearchTerm }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className="relative mb-6 w-full max-w-2xl mx-auto">
      <input
        ref={inputRef}
        type="text"
        placeholder="搜索工具..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full px-4 py-3 pl-12 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
    </div>
  )
}
