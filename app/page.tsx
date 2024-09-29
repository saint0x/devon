"use client"

import { useState, useCallback } from 'react'
import { ResizableBox } from 'react-resizable'
import Chat from '@/components/Chat'
import IDE from '@/components/IDE'
import Terminal from '@/components/Terminal'
import BrowserFile from '@/components/BrowserFile'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'

import 'react-resizable/css/styles.css'

const MIN_HEIGHT = 200
const MIN_WIDTH = 300
const MAX_HEIGHT = 800

export default function DevonAI() {
  const [sizes, setSizes] = useState({
    chat: { width: '100%', height: 400 },
    ide: { width: '100%', height: 400 },
    browserFile: { width: '100%', height: 400 },
    terminal: { width: '100%', height: 400 },
  })

  const [url, setUrl] = useState('https://www.example.com')
  const { theme, setTheme } = useTheme()

  const onResize = useCallback((component: keyof typeof sizes) => (_: unknown, { size }: { size: { width: number; height: number } }) => {
    setSizes(prevSizes => ({
      ...prevSizes,
      [component]: { ...prevSizes[component], height: size.height },
    }))
  }, [])

  const handleBrowse = (newUrl: string) => {
    setUrl(newUrl)
  }

  return (
    <div className="flex flex-col min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">Devin</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <SunIcon className="h-[1.2rem] w-[1.2rem]" /> : <MoonIcon className="h-[1.2rem] w-[1.2rem]" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
      <Card className="flex-grow rounded-xl overflow-hidden bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardContent className="p-4 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            {Object.entries(sizes).map(([key, size]) => (
              <ResizableBox
                key={key}
                width={Infinity}
                height={size.height}
                minConstraints={[MIN_WIDTH, MIN_HEIGHT]}
                maxConstraints={[Infinity, MAX_HEIGHT]}
                onResize={onResize(key as keyof typeof sizes)}
                className="overflow-hidden w-full"
              >
                <div className="w-full h-full border border-black dark:border-white">
                  {key === 'chat' && <Chat />}
                  {key === 'ide' && <IDE />}
                  {key === 'browserFile' && <BrowserFile url={url} onBrowse={handleBrowse} />}
                  {key === 'terminal' && <Terminal />}
                </div>
              </ResizableBox>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}