import { Tool } from '@/types/Tool'
import { ToolItem } from './ToolItem'

interface ToolListProps {
  tools: Tool[]
}

export function ToolList({ tools }: ToolListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map(tool => (
        <ToolItem key={tool.id} tool={tool} />
      ))}
    </div>
  )
}
