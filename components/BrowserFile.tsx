"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileIcon, FolderIcon, ChevronLeft, ChevronRight, RefreshCw, Save, Trash } from 'lucide-react'

interface FileItem {
  name: string
  isDirectory: boolean
  size?: number
  modified?: Date
}

interface BrowserFileProps {
  url: string
  onBrowse: (newUrl: string) => void
}

export default function BrowserFile({ url, onBrowse }: BrowserFileProps) {
  const [activeTab, setActiveTab] = useState('browser')
  const [inputUrl, setInputUrl] = useState(url)
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [currentPath, setCurrentPath] = useState('/')
  const [files, setFiles] = useState<FileItem[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string>('')

  const handleNavigate = async (urlToNavigate: string) => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/browse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlToNavigate }),
      })

      const result = await response.json()

      if (result.contentType.startsWith('text/html')) {
        setContent(atob(result.data))
      } else {
        setContent(`Content type ${result.contentType} is not supported for direct display.`)
      }

      setInputUrl(urlToNavigate)
      onBrowse(urlToNavigate)
    } catch (error) {
      console.error('Error fetching page:', error)
      setContent('An error occurred while loading the page.')
    }
    setLoading(false)
  }

  const fetchDirectory = async (path: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/fs/list?path=${encodeURIComponent(path)}`)
      const data = await response.json()
      setFiles(data)
      setCurrentPath(path)
    } catch (error) {
      console.error('Error fetching directory:', error)
    }
  }

  const handleFileAction = async (file: FileItem) => {
    if (file.isDirectory) {
      fetchDirectory(`${currentPath}${file.name}/`)
    } else {
      try {
        const response = await fetch(`http://localhost:3001/api/fs/read?path=${encodeURIComponent(`${currentPath}${file.name}`)}`)
        const content = await response.text()
        setSelectedFile(file.name)
        setFileContent(content)
      } catch (error) {
        console.error('Error reading file:', error)
      }
    }
  }

  const handleSaveFile = async () => {
    if (selectedFile) {
      try {
        await fetch('http://localhost:3001/api/fs/write', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: `${currentPath}${selectedFile}`,
            content: fileContent,
          }),
        })
        console.log('File saved successfully')
      } catch (error) {
        console.error('Error saving file:', error)
      }
    }
  }

  const handleDeleteFile = async () => {
    if (selectedFile) {
      try {
        await fetch(`http://localhost:3001/api/fs/delete?path=${encodeURIComponent(`${currentPath}${selectedFile}`)}`, {
          method: 'DELETE',
        })
        setSelectedFile(null)
        setFileContent('')
        fetchDirectory(currentPath)
      } catch (error) {
        console.error('Error deleting file:', error)
      }
    }
  }

  useEffect(() => {
    // Initial load of browser content
    handleNavigate(url)
    // Initial load of file system
    fetchDirectory('/')
  }, [url])

  useEffect(() => {
    if (activeTab === 'browser') {
      handleNavigate(inputUrl)
    } else if (activeTab === 'files') {
      fetchDirectory(currentPath)
    }
  }, [activeTab])

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
                onKeyPress={(e) => e.key === 'Enter' && handleNavigate(inputUrl)}
                className="mr-2 flex-grow"
              />
              <Button onClick={() => handleNavigate(inputUrl)} variant="ghost" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <div className="w-full h-[calc(100%-52px)] overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">Loading...</div>
              ) : (
                <iframe
                  srcDoc={content}
                  sandbox="allow-scripts"
                  className="w-full h-full"
                />
              )}
            </div>
          </TabsContent>
          <TabsContent value="files" className="h-[calc(100%-40px)] m-0 flex">
            <div className="w-1/2 border-r">
              <div className="flex items-center p-2 border-b bg-gray-100">
                <Button variant="ghost" size="icon" className="mr-1" onClick={() => fetchDirectory(currentPath.split('/').slice(0, -2).join('/') + '/')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Input value={currentPath} readOnly className="flex-grow" />
              </div>
              <ScrollArea className="h-[calc(100%-52px)]">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleFileAction(file)}
                  >
                    {file.isDirectory ? (
                      <FolderIcon className="mr-2 text-blue-500" />
                    ) : (
                      <FileIcon className="mr-2 text-gray-500" />
                    )}
                    <div className="flex-grow">
                      <div>{file.name}</div>
                      <div className="text-xs text-gray-500">{file.modified?.toLocaleString()}</div>
                    </div>
                    {file.size && <div className="text-sm text-gray-500">{file.size} bytes</div>}
                  </div>
                ))}
              </ScrollArea>
            </div>
            <div className="w-1/2 p-2">
              {selectedFile && (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">{selectedFile}</h3>
                    <div>
                      <Button onClick={handleSaveFile} variant="ghost" size="icon" className="mr-2">
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button onClick={handleDeleteFile} variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <textarea
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    className="w-full h-[calc(100%-40px)] p-2 border rounded"
                  />
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}