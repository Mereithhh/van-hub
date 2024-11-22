'use client'

import { Tool } from '@/types/Tool'
import { useState, useMemo } from 'react'
import { Search, ChevronLeft, ChevronRight, Home, Tag } from 'lucide-react'
import Link from 'next/link'


interface ToolSidebarProps {
  tools: Tool[]
  currentToolId: string
}

export function ToolSidebar({ tools, currentToolId }: ToolSidebarProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('')

  // 获取所有唯一的标签
  const allTags = useMemo(() => {
    const tags = tools.flatMap(tool => tool.tags)
    return Array.from(new Set(tags))
  }, [tools])

  const currentTool = tools.find(tool => tool.id === currentToolId)

  // 根据搜索词和标签筛选工具
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTag = selectedTag ? tool.tags.includes(selectedTag) : true
      return matchesSearch && matchesTag
    })
  }, [tools, searchTerm, selectedTag])

  return (
    <div className={`relative transition-all duration-300 ease-in-out border-r border-gray-200 bg-white
      ${isOpen ? 'w-64' : 'w-16'}`}
    >
      <div className="h-full flex flex-col">
        {/* 顶部区域：工具名称和主页图标 */}
        <div className="p-3 border-b">
          <div className="flex items-center justify-between">
            {isOpen ? (
              <>
                <h2 className="font-medium truncate">{currentTool?.name}</h2>
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  <Home className="w-5 h-5" />
                </Link>
              </>
            ) : (
              <Link href="/" className="mx-auto text-gray-600 hover:text-gray-900">
                <Home className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>

        {/* 搜索框 */}
        {isOpen && (
          <div className="p-3 border-b">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索工具..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-8 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
        )}

        {/* 标签筛选区域 */}
        {isOpen && (
          <div className="p-2 border-b">
            <div className="flex items-center gap-1 mb-2">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">标签筛选</span>
            </div>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setSelectedTag('')}
                className={`text-xs px-2 py-1 rounded-md ${selectedTag === ''
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
              >
                全部
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`text-xs px-2 py-1 rounded-md ${selectedTag === tag
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 工具列表 - 添加滚动容器 */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="space-y-1 p-2">
            {filteredTools.map(tool => (
              <Link key={tool.id} href={`/tool/${tool.id}`}>
                <div
                  className={`px-3 py-2 text-sm rounded-md cursor-pointer
                    ${tool.id === currentToolId
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  title={tool.name}
                >
                  {isOpen ? (
                    <div>
                      <div>{tool.name}</div>
                      {tool.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {tool.tags.map(tag => (
                            <span
                              key={tag}
                              className={`text-xs px-1.5 py-0.5 rounded ${tool.id === currentToolId
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-gray-100 text-gray-600'
                                }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    tool?.name?.charAt(0)
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 优化后的展开/收起按钮区域 */}
        <div className="px-3 py-2 border-t">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-center gap-2 p-1.5 hover:bg-gray-100 rounded-md text-gray-600"
          >
            {isOpen ? (
              <>
                <ChevronLeft size={16} />
                <span className="text-sm">收起侧栏</span>
              </>
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}