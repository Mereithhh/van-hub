'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Tool } from '@/types/Tool'
import Link from 'next/link'
import { useToast } from "@/hooks/use-toast"

type Tab = 'tools' | 'settings'

export default function ToolsAdmin() {
  const [tools, setTools] = useState<Tool[]>([])
  const [newTool, setNewTool] = useState<Partial<Tool>>({ name: '', description: '', url: '', tags: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [editingTool, setEditingTool] = useState<Tool | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('tools')
  const [settings, setSettings] = useState({
    username: '',
    password: '',
    siteTitle: '',
    siteIcon: ''
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        if (res.ok) {
          const data = await res.json()
          setSettings({
            ...settings,
            ...data,
            password: '' // 不显示密码
          })
        }
      } catch (err) {
        console.error('获取设置失败:', err)
      }
    }

    checkAuth()
    fetchSettings()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/login', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!res.ok) {
        router.push('/admin/login')
        return
      }

      const data = await res.json()
      if (!data.isAuthenticated) {
        router.push('/admin/login')
        return
      }

      // 只有验证通过后才获取工具列表
      fetchTools()
    } catch (err) {
      router.push('/admin/login')
    }
  }

  const fetchTools = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/tools', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      if (res.ok) {

        const data = await res.json()

        setTools(data.map((tool: Tool) => ({
          ...tool
        })))
      } else {
        router.push('/admin/login')
      }
    } catch (err) {
      setError('获���工具列表失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newTool),
      })
      if (res.ok) {
        setNewTool({ name: '', description: '', url: '', tags: [] })
        fetchTools()
      } else if (res.status === 401) {
        setError('未登录或登录已过期')
        router.push('/admin/login')
      } else {
        setError('添加工具失败')
      }
    } catch (err) {
      setError('添加工具失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/tools/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      if (res.ok) {
        fetchTools()
      } else if (res.status === 401) {
        setError('未登录或登录已过期')
        router.push('/admin/login')
      } else {
        setError('删除工具失败')
      }
    } catch (err) {
      setError('删除工具失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (tool: Tool) => {
    // 滚动到最上面
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setEditingTool(tool)
  }

  const handleUpdateTool = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTool) return

    setIsLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/tools/${editingTool.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(editingTool),
      })
      if (res.ok) {
        setEditingTool(null)
        fetchTools()
      } else if (res.status === 401) {
        setError('未登录或登录已过期')
        router.push('/admin/login')
      } else {
        setError('更新工具失败')
      }
    } catch (err) {
      setError('更新工具失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        toast({
          title: "成功",
          description: "设置已保存",
        })
        setError('')
      } else if (res.status === 401) {
        toast({
          variant: "destructive",
          title: "错误",
          description: "未登录或登录已过期",
        })
        router.push('/admin/login')
      } else {
        toast({
          variant: "destructive",
          title: "错误",
          description: "保存设置失败",
        })
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "保存设置失败",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 添加登出处理函数
  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/admin/login')
  }

  // 获取所有唯一的标签
  const allTags = Array.from(new Set(tools.flatMap(tool => tool.tags)))

  // 根据选中的标签筛选工具
  const filteredTools = tools.filter(tool =>
    selectedTags.length === 0 ||
    selectedTags.some(tag => tool.tags.includes(tag))
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link href="/" className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-md mr-4">
            返回
          </Link>
          <h1 className="text-3xl font-bold">管理后台</h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-md"
        >
          退出登录
        </button>
      </div>

      {/* 添加 Tab 导航 */}
      <div className="flex border-b mb-8">
        <button
          onClick={() => setActiveTab('tools')}
          className={`px-4 py-2 mr-2 ${activeTab === 'tools'
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-600 hover:text-gray-800'
            }`}
        >
          工具管理
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 ${activeTab === 'settings'
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-600 hover:text-gray-800'
            }`}
        >
          网站设置
        </button>
      </div>

      {activeTab === 'settings' ? (
        // 网站设置表单
        <form onSubmit={handleSaveSettings} className="max-w-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">账号设置</h2>
            <input
              type="text"
              placeholder="管理员用户名"
              value={settings.username}
              onChange={(e) => setSettings({ ...settings, username: e.target.value })}
              className="mb-2 w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="管理员密码"
              value={settings.password}
              onChange={(e) => setSettings({ ...settings, password: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">网站设置</h2>
            <input
              type="text"
              placeholder="网站标题"
              value={settings.siteTitle}
              onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
              className="mb-2 w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="网站图标地址"
              value={settings.siteIcon}
              onChange={(e) => setSettings({ ...settings, siteIcon: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-md disabled:opacity-50"
          >
            {isLoading ? '保存中...' : '保存设置'}
          </button>
        </form>
      ) : (
        <>
          {/* 添加/编辑表单的按钮样式 */}
          {!editingTool ? (
            <form onSubmit={handleSubmit} className="mb-8">
              <input
                type="text"
                placeholder="名称"
                value={newTool.name}
                onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                className="mb-2 w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="描述"
                value={newTool.description}
                onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
                className="mb-2 w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="URL"
                value={newTool.url}
                onChange={(e) => setNewTool({ ...newTool, url: e.target.value })}
                className="mb-2 w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="标签（用逗号分隔）"
                value={newTool.tags?.join(', ')}
                onChange={(e) => setNewTool({ ...newTool, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                className="mb-2 w-full p-2 border rounded"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-md disabled:opacity-50"
              >
                {isLoading ? '添加中...' : '添加工具'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleUpdateTool} className="mb-8">
              <input
                type="text"
                placeholder="名称"
                value={editingTool.name}
                onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                className="mb-2 w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="描述"
                value={editingTool.description}
                onChange={(e) => setEditingTool({ ...editingTool, description: e.target.value })}
                className="mb-2 w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="URL"
                value={editingTool.url}
                onChange={(e) => setEditingTool({ ...editingTool, url: e.target.value })}
                className="mb-2 w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="标签（用逗号分隔）"
                value={editingTool.tags.join(', ')}
                onChange={(e) => setEditingTool({ ...editingTool, tags: e.target.value.split(',').map(tag => tag.trim()) })}
                className="mb-2 w-full p-2 border rounded"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-md disabled:opacity-50"
                >
                  {isLoading ? '更新中...' : '更新工具'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTool(null)}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-md"
                >
                  取消
                </button>
              </div>
            </form>
          )}

          {error && <div className="text-red-500 mb-4">{error}</div>}

          {/* 标签筛选区域 */}
          <div className="mb-4">
            <h2 className="text-xl mb-2">按标签筛选：</h2>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTags(prev =>
                      prev.includes(tag)
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    )
                  }}
                  className={`px-3 py-1 rounded-md text-sm ${selectedTags.includes(tag)
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* �����列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map(tool => (
              <div key={tool.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold mb-2">{tool.name}</h2>
                <p className="text-gray-600 mb-2">{tool.description}</p>
                <p className="text-gray-600 mb-2">URL: {tool.url}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.tags.map(tag => (
                    <span
                      key={tag}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(tool)}
                    disabled={isLoading}
                    className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-3 py-1.5 rounded-md disabled:opacity-50 text-sm"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(tool.id)}
                    disabled={isLoading}
                    className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-md disabled:opacity-50 text-sm"
                  >
                    {isLoading ? '删除中...' : '删除'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
