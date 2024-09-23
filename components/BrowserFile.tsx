"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileIcon, FolderIcon, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'

interface FileItem {
  name: string
  type: 'file' | 'folder'
  size?: string
  modified?: string
}

interface BrowserFileProps {
  url: string
  onBrowse: (newUrl: string) => void
  files: FileItem[]
}

export default function BrowserFile({ url, onBrowse, files }: BrowserFileProps) {
  const [activeTab, setActiveTab] = useState('browser')
  const [inputUrl, setInputUrl] = useState(url)

  const handleNavigate = () => {
    onBrowse(inputUrl)
  }

  const handleFileAction = (file: FileItem) => {
    if (file.type === 'folder') {
      console.log(`Opening folder: ${file.name}`)
    } else {
      console.log(`Opening file: ${file.name}`)
    }
  }

  return (
    <Card className="flex flex-col h-full">
      <CardContent className="flex-grow p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="w-full justify-start rounded-none border-b">
            <TabsTrigger value="browser">Browser</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>
          <TabsContent value="browser" className="h-[calc(100%-40px)] m-0">
            <div className="flex items-center p-2 border-b bg-gray-100">
              <Button variant="ghost" size="icon" className="mr-1" onClick={() => window.history.back()}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="mr-2" onClick={() => window.history.forward()}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Input
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNavigate()}
                className="mr-2 flex-grow"
              />
              <Button onClick={handleNavigate} variant="ghost" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <iframe src={url} className="w-full h-[calc(100%-52px)]" />
          </TabsContent>
          <TabsContent value="files" className="h-[calc(100%-40px)] m-0">
            <ScrollArea className="h-full">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleFileAction(file)}
                >
                  {file.type === 'folder' ? (
                    <FolderIcon className="mr-2 text-blue-500" />
                  ) : (
                    <FileIcon className="mr-2 text-gray-500" />
                  )}
                  <div className="flex-grow">
                    <div>{file.name}</div>
                    <div className="text-xs text-gray-500">{file.modified}</div>
                  </div>
                  {file.size && <div className="text-sm text-gray-500">{file.size}</div>}
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}