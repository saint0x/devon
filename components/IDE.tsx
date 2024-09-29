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
  const [output, setOutput] = useState('')

  const handleRunCode = () => {
    setOutput('') // Clear previous output
    if (language === 'javascript') {
      try {
        // Create a custom console object to capture logs
        const customConsole = {
          log: (...args: any[]) => {
            setOutput(prev => prev + args.join(' ') + '\n')
          },
          error: (...args: any[]) => {
            setOutput(prev => prev + 'Error: ' + args.join(' ') + '\n')
          },
          warn: (...args: any[]) => {
            setOutput(prev => prev + 'Warning: ' + args.join(' ') + '\n')
          }
        }

        // Wrap the code in a function that uses the custom console
        const wrappedCode = `
          (function() {
            const console = ${JSON.stringify(customConsole)};
            ${code}
          })()
        `

        // Use Function constructor instead of eval for better security
        new Function(wrappedCode)()

        if (output === '') {
          setOutput('Code executed successfully, but there was no output.')
        }
      } catch (error: unknown) {
        setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`)
      }
    } else {
      setOutput(`Execution for ${language} is not implemented in this demo.`)
    }
  }

  return (
    <Card className="flex flex-col h-full bg-zinc-900 text-white">
      <CardContent className="flex-grow p-0 flex flex-col">
        <div className="flex justify-between items-center p-2 border-b border-zinc-700">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px] bg-zinc-800 text-white border-zinc-700">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 text-white border-zinc-700">
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRunCode} className="ml-2 bg-green-600 hover:bg-green-700">
            <Play className="mr-2 h-4 w-4" /> Run Code
          </Button>
        </div>
        <div className="flex-grow">
          <Editor
            height="100%"
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
          />
        </div>
        <div className="p-2 bg-black text-green-500 font-mono text-sm h-32 overflow-auto">
          <div className="font-bold mb-1">Output:</div>
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
      </CardContent>
    </Card>
  )
}