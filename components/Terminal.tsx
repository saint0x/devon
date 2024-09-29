"use client"

import { Card, CardContent } from '@/components/ui/card'
import dynamic from 'next/dynamic'

const TerminalInner = dynamic(() => import('./TerminalInner'), { ssr: false })

export default function TerminalWrapper() {
  return (
    <Card className="flex flex-col h-full bg-black">
      <CardContent className="flex-grow p-2">
        <TerminalInner />
      </CardContent>
    </Card>
  )
}