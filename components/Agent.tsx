"use client"

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar } from '@/components/ui/avatar'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Agent() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: Message = { role: 'user', content: input }
      setMessages(prev => [...prev, userMessage])
      setInput('')
      setIsTyping(true)

      try {
        const response = await fetch('http://localhost:3001/api/agent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input }),
        })

        if (!response.ok) {
          throw new Error('Failed to get response from server')
        }

        const data = await response.json()
        const aiMessage: Message = { role: 'assistant', content: data.message }
        setMessages(prev => [...prev, aiMessage])
      } catch (error) {
        console.error('Error:', error)
        const errorMessage: Message = { role: 'assistant', content: 'Sorry, I encountered an error while processing your request.' }
        setMessages(prev => [...prev, errorMessage])
      } finally {
        setIsTyping(false)
      }
    }
  }

  return (
    <Card className="flex flex-col h-full">
      <CardContent className="flex-grow flex flex-col p-0">
        <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className={`flex ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start`}>
                <Avatar className="w-8 h-8">
                  {message.role === 'user' ? 'U' : 'D'}
                </Avatar>
                <div className={`max-w-[70%] ${message.role === 'user' ? 'mr-2' : 'ml-2'}`}>
                  <div className={`p-3 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {message.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="flex flex-row items-start">
                <Avatar className="w-8 h-8">D</Avatar>
                <div className="ml-2 p-3 rounded-lg bg-muted">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Devon anything..."
              className="flex-grow"
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}