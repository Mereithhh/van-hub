import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '@/lib/db'

// 获取设置的 GET 方法保持不变,但移除 token 验证,允许公开访问
export async function GET() {
  try {
    const settings = db.prepare('SELECT siteTitle, siteIcon, username FROM settings LIMIT 1').get()

    if (!settings) {
      return NextResponse.json({
        siteTitle: 'Van Hub',
        siteIcon: '',
        username: 'admin'
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('获取设置失败:', error)
    return NextResponse.json(
      { error: '获取设置失败' },
      { status: 500 }
    )
  }
}

// 更新设置
export async function POST(request: Request) {
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
    const { username, password, siteTitle, siteIcon } = await request.json()

    // 验证必填字段
    if (!username?.trim()) {
      return NextResponse.json({ error: '用户名不能为空' }, { status: 400 })
    }

    // 开始数据库事务
    db.exec('BEGIN TRANSACTION')

    try {
      const existingSettings = db.prepare('SELECT * FROM settings LIMIT 1').get()
      const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(existingSettings?.username || 'admin')

      // 更新用户表
      if (username !== existingUser?.username) {
        // 检查新用户名是否已存在
        const userExists = db.prepare('SELECT 1 FROM users WHERE username = ? AND username != ?').get(username, existingUser?.username)
        if (userExists) {
          db.exec('ROLLBACK')
          return NextResponse.json({ error: '用户名已存在' }, { status: 400 })
        }

        // 先创建新用户
        const currentPassword = existingUser?.password || ''
        db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(
          username,
          currentPassword
        )

        // 删除旧用户
        db.prepare('DELETE FROM users WHERE username = ?').run(existingUser?.username)
      }

      // 如果提供了新密码则更新密码
      if (password?.trim()) {
        const hashedPassword = await bcrypt.hash(password, 10)
        db.prepare('UPDATE users SET password = ? WHERE username = ?').run(
          hashedPassword,
          username
        )
      }

      // 更新设置表
      if (existingSettings) {
        // 如果没有提供新密码，使用现有的密码
        const currentPassword = db.prepare('SELECT password FROM users WHERE username = ?').get(username)?.password

        db.prepare(`
          UPDATE settings 
          SET username = ?, 
              password = ?,
              siteTitle = ?, 
              siteIcon = ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(
          username,
          currentPassword, // 使用当前密码
          siteTitle?.trim() || 'Van Hub',
          siteIcon?.trim() || '',
          existingSettings.id
        )
      } else {
        // 获取用户当前密码
        const currentPassword = db.prepare('SELECT password FROM users WHERE username = ?').get(username)?.password

        db.prepare(`
          INSERT INTO settings (username, password, siteTitle, siteIcon)
          VALUES (?, ?, ?, ?)
        `).run(
          username,
          currentPassword, // 使用当前密码
          siteTitle?.trim() || 'Van Hub',
          siteIcon?.trim() || ''
        )
      }

      // 提交事务
      db.exec('COMMIT')
      return NextResponse.json({ success: true, message: '设置已更新' })

    } catch (error) {
      // 发生错误时回滚事务
      db.exec('ROLLBACK')
      throw error
    }

  } catch (error) {
    console.error('更新设置失败:', error)
    return NextResponse.json(
      { error: '更新设置失败' },
      { status: 500 }
    )
  }
}
