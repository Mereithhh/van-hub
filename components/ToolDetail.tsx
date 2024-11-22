'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Tool } from '@/types/Tool'
import { ToolSidebar } from './ToolSidebar'
import { useState } from 'react'
interface ToolDetailProps {
  tool: Tool
  allTools: Tool[]
}


export function ToolDetail({ tool, allTools }: ToolDetailProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  return (
    <div className="h-screen flex">
      {tool?.id && (<ToolSidebar tools={allTools} currentToolId={tool.id} />)}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 relative">
          {isLoading && !loadError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          )}
          {loadError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
              <p className="text-lg text-gray-600 mb-4">抱歉，该网页无法在此处显示（不支持内嵌）</p>
              <div className="flex flex-col items-center gap-4">
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 underline"
                >
                  点击此处在新标签页中打开
                </a>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">告诉我一声？帮助我改进，兴许我就搞出来了呢</p>
                  <a
                    href={`https://github.com/mereithhh/van-hub/issues/new?title=工具加载失败: ${tool.name}&body=URL: ${tool.url}%0A%0A描述问题:`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    提交问题反馈
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <iframe
              src={tool.url}
              className="w-full h-full border-none"
              title={tool.name}
              onLoad={(e) => {
                try {
                  const iframe = e.target as HTMLIFrameElement;
                  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

                  if (!iframeDoc || iframeDoc.title.toLowerCase().includes('404')) {
                    setLoadError(true);
                  } else {
                    setIsLoading(false);
                  }
                } catch (err) {
                  console.error('访问 iframe 内容时出错:', err);
                  setLoadError(true);
                }
              }}
              onError={(err) => {
                console.error('加载工具时出错:', err);
                setLoadError(true);
                setIsLoading(false);
              }}
              allow="microphone; camera; display-capture; geolocation; autoplay; clipboard-write; clipboard-read; fullscreen; accelerometer; gyroscope; payment; midi; usb; encrypted-media; picture-in-picture"
              allowFullScreen
              referrerPolicy="no-referrer"
            />
          )}
        </main>
      </div>
    </div>
  )
}
