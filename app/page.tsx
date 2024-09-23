"use client"

import { useState, useCallback, useEffect } from 'react'
import { ResizableBox } from 'react-resizable'
import Chat from '@/components/Chat'
import IDE from '@/components/IDE'
import Terminal from '@/components/Terminal'
import BrowserFile from '@/components/BrowserFile'
import { Card, CardContent } from '@/components/ui/card'

import 'react-resizable/css/styles.css'

const MIN_HEIGHT = 200
const MIN_WIDTH = 300

interface FileItem {
  name: string
  type: 'file' | 'folder'
  size?: string
  modified?: string
}

export default function DevonAI() {
  const [sizes, setSizes] = useState({
    chat: { width: 600, height: 400 },
    ide: { width: 600, height: 400 },
    browserFile: { width: 600, height: 400 },
    terminal: { width: 600, height: 400 },
  })

  const [url, setUrl] = useState('https://www.example.com')
  const [files, setFiles] = useState<FileItem[]>([])

  const onResize = useCallback((component: keyof typeof sizes) => (_: unknown, { size }: { size: { width: number; height: number } }) => {
    setSizes(prevSizes => ({
      ...prevSizes,
      [component]: size,
    }))
  }, [])

  useEffect(() => {
    const fetchFiles = async () => {
      const mockFiles: FileItem[] = [
        { name: 'Documents', type: 'folder', modified: '2023-05-15 10:30' },
        { name: 'Downloads', type: 'folder', modified: '2023-05-14 15:45' },
        { name: 'project.txt', type: 'file', size: '2.5 KB', modified: '2023-05-13 09:20' },
        { name: 'image.jpg', type: 'file', size: '1.2 MB', modified: '2023-05-12 14:10' },
      ]
      setFiles(mockFiles)
    }

    fetchFiles()
  }, [])

  const handleBrowse = (newUrl: string) => {
    setUrl(newUrl)
  }

  return (
    <div className="flex flex-col h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">Devin</h1>
      <Card className="flex-grow rounded-xl overflow-hidden bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
            <ResizableBox
              width={sizes.chat.width}
              height={sizes.chat.height}
              minConstraints={[MIN_WIDTH, MIN_HEIGHT]}
              onResize={onResize('chat')}
              className="overflow-hidden"
            >
              <Chat />
            </ResizableBox>
            <ResizableBox
              width={sizes.ide.width}
              height={sizes.ide.height}
              minConstraints={[MIN_WIDTH, MIN_HEIGHT]}
              onResize={onResize('ide')}
              className="overflow-hidden"
            >
              <IDE />
            </ResizableBox>
            <ResizableBox
              width={sizes.browserFile.width}
              height={sizes.browserFile.height}
              minConstraints={[MIN_WIDTH, MIN_HEIGHT]}
              onResize={onResize('browserFile')}
              className="overflow-hidden"
            >
              <BrowserFile url={url} onBrowse={handleBrowse} files={files} />
            </ResizableBox>
            <ResizableBox
              width={sizes.terminal.width}
              height={sizes.terminal.height}
              minConstraints={[MIN_WIDTH, MIN_HEIGHT]}
              onResize={onResize('terminal')}
              className="overflow-hidden"
            >
              <Terminal />
            </ResizableBox>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}