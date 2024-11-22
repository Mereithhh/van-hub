'use client'

import { useEffect, useState } from 'react'

export default function Title() {
  const [siteTitle, setSiteTitle] = useState('Van Hub')

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings')
        if (res.ok) {
          const data = await res.json()
          if (data.siteTitle) {
            setSiteTitle(data.siteTitle)
          }
        }
      } catch (err) {
        console.error('获取网站设置失败:', err)
      }
    }

    fetchSettings()
  }, [])

  return <div className="flex items-center justify-center gap-2 mb-8">
    <h1 className="text-3xl font-bold text-center">{siteTitle}</h1>
  </div>
}
