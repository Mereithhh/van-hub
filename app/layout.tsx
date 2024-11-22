import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import db from '@/lib/db'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = db.prepare('SELECT siteTitle, siteIcon FROM settings LIMIT 1').get()

    return {
      title: settings?.siteTitle || 'Van Hub',
      description: '汇总你的零零散散',
      icons: settings?.siteIcon ? [
        {
          url: settings.siteIcon,
          rel: 'icon',
        }
      ] : undefined
    }
  } catch (error) {
    console.error('获取设置失败:', error)
    return {
      title: 'Van Hub',
      description: '汇总你的零零散散'
    }
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}<Toaster /></body>
    </html>
  )
}