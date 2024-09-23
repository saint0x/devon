"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Editor from '@monaco-editor/react'
import { Button } from '@/components/ui/button'
import { Play } from 'lucide-react'

export default function IDE() {
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState('// Start coding here')

  const handleRunCode = () => {
    // In a real implementation, this would send the code to a backend for execution
    console.log('Running code:', code)
    // For demonstration, we'll evaluate JavaScript code in the browser
    if (language === 'javascript') {
      try {
        // eslint-disable-next-line no-eval
        eval(code)
      } catch (error) {
        console.error('Error executing code:', error)
      }
    }
  }

  return (
    <Card className="flex flex-col h-full">
      <CardContent className="flex-grow p-0">
        <div className="flex justify-between items-center p-2 border-b">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRunCode} className="ml-2">
            <Play className="mr-2 h-4 w-4" /> Run Code
          </Button>
        </div>
        <Editor
          height="calc(100% - 52px)"
          language={language}
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
          }}
          beforeMount={(monaco) => {
            monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
              noSemanticValidation: true,
              noSyntaxValidation: false,
            })
          }}
        />
      </CardContent>
    </Card>
  )
}