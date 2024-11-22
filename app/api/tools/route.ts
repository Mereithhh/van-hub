import { NextResponse } from 'next/server'
import db from '@/lib/db'
import jwt from 'jsonwebtoken'

export async function GET() {
  const tools = db.prepare('SELECT * FROM tools').all()
  return NextResponse.json(tools.map(tool => ({
    ...tool,
    id: tool.id.toString(),
    tags: tool.tags ? JSON.parse(tool.tags) : []
  })))
}

export async function POST(request: Request) {
  const token = request.headers.get('Authorization')?.split(' ')[1]
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const { name, description, url, tags } = await request.json()

  const stmt = db.prepare(`
    INSERT INTO tools (name, description, url, tags)
    VALUES (?, ?, ?, ?)
  `)

  const result = stmt.run(name, description, url, JSON.stringify(tags))

  return NextResponse.json({ id: result.lastInsertRowid })
}

