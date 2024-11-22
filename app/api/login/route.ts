import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '@/lib/db'

export async function POST(request: Request) {
  const { username, password } = await request.json()

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username)

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' })
    return NextResponse.json({ token })
  } else {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
}

export async function GET(request: Request) {
  const token = request.headers.get('Authorization')?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    return NextResponse.json({
      isAuthenticated: true,
      userId: decoded.id
    })
  } catch (error) {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 })
  }
}
