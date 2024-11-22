import { notFound } from 'next/navigation'
import { ToolDetail } from '@/components/ToolDetail'
import db from '@/lib/db'
export default async function ToolPage({ params }: { params: { id: string } }) {
  try {
    // 获取指定工具和所有工具的数据
    const tool = db.prepare('SELECT * FROM tools WHERE id = ?').get(params.id)
    const allTools = db.prepare('SELECT * FROM tools').all()

    if (!tool) {
      notFound()
    }

    // 格式化数据，确保 tags 是数组格式
    const formattedTool = {
      ...tool,
      id: tool.id.toString(),
      tags: tool.tags ? JSON.parse(tool.tags) : []
    }

    const formattedAllTools = allTools.map(t => ({
      ...t,
      id: t.id.toString(),
      tags: t.tags ? JSON.parse(t.tags) : []
    }))

    return (
      <ToolDetail
        tool={formattedTool}
        allTools={formattedAllTools}
      />
    )
  } catch (error) {
    console.error("Error fetching tool:", error)
    notFound()
  }
}
