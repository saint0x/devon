"use client"

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function Terminal() {
  const [history, setHistory] = useState<string[]>(['Welcome to Devon AI Terminal'])
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [history])

  const handleCommand = (command: string) => {
    setHistory(prev => [...prev, `$ ${command}`])
    
    // Simulate command execution
    setTimeout(() => {
      let response: string
      switch (command.toLowerCase()) {
        case 'help':
          response = 'Available commands: help, clear, echo, ls, cd, pwd'
          break
        case 'clear':
          setHistory([])
          return
        case 'echo':
          response = command.slice(5) // Remove 'echo ' from the start
          break
        case 'ls':
          response = 'Documents\nDownloads\nPictures\nMusic\nVideos'
          break
        case 'cd':
          response = 'Changed directory (simulated)'
          break
        case 'pwd':
          response = '/Users/devon/Desktop'
          break
        default:
          response = `Command not found: ${command}`
      }
      setHistory(prev => [...prev, response])
    }, 100)

    setInput('')
  }

  return (
    <Card className="flex flex-col h-full bg-black text-green-500 font-mono">
      <CardContent className="flex-grow p-0">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          {history.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
          <div className="flex">
            <span>$ </span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCommand(input)}
              className="flex-grow bg-transparent outline-none"
              autoFocus
            />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}