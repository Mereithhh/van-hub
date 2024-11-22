import { Tool } from '@/types/Tool'
import Link from 'next/link'

interface ToolItemProps {
  tool: Tool
}

export function ToolItem({ tool }: ToolItemProps) {
  return (
    <div className="relative">
      <Link
        href={`/tool/${tool.id}`}
        className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      >
        <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
        <p className="text-gray-600 mb-4">{tool.description}</p>
        <div className="flex flex-wrap gap-2">
          {tool.tags.map(tag => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>

      {tool.url && (
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          title="在新标签页打开"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      )}
    </div>
  )
}
