import { NextResponse } from 'next/server'
import db from '@/lib/db'
import jwt from 'jsonwebtoken'

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const token = request.headers.get('Authorization')?.split(' ')[1]
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const stmt = db.prepare('DELETE FROM tools WHERE id = ?')
  stmt.run(params.id)

  return NextResponse.json({ success: true })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const token = request.headers.get('Authorization')?.split(' ')[1]
  if (!token) {
    return NextResponse.json({ error: '未授权访问' }, { status: 401 })
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!)
  } catch (error) {
    return NextResponse.json({ error: '无效的令牌' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, description, url, tags } = body

    if (!name || !description || !url) {
      return NextResponse.json(
        { error: '名称、描述和URL为必填项' },
        { status: 400 }
      )
    }

    const stmt = db.prepare(`
      UPDATE tools 
      SET name = ?, description = ?, url = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)

    const result = stmt.run(name, description, url, JSON.stringify(tags), params.id)

    if (result.changes === 0) {
      return NextResponse.json(
        { error: '未找到要更新的工具' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '工具更新成功'
    })

  } catch (error) {
    console.error('更新工具时出错:', error)
    return NextResponse.json(
      { error: '更新工具失败' },
      { status: 500 }
    )
  }
}
