"use client"

import React, { useRef, useEffect, useState } from 'react'
import type { Terminal as XTerminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

const PROMPT = '\x1b[1;32mdevon>\x1b[0m '

export default function TerminalInner() {
  const terminalRef = useRef<HTMLDivElement>(null)
  const [terminal, setTerminal] = useState<XTerminal | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !terminalRef.current) return;

    const loadTerminal = async () => {
      const { Terminal } = await import('xterm');
      const { FitAddon } = await import('xterm-addon-fit');

      const term = new Terminal({
        cursorBlink: true,
        theme: {
          background: '#000000',
          foreground: '#ffffff',
          cursor: '#00ff00',
        },
        fontFamily: '"Cascadia Code", Menlo, monospace',
        fontSize: 14,
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);

      if (terminalRef.current) {
        term.open(terminalRef.current);
        fitAddon.fit();
      }

      term.writeln('Welcome to Devon AI Terminal');
      term.writeln('Type "help" for available commands');
      term.write(PROMPT);

      setTerminal(term);

      const handleResize = () => {
        fitAddon.fit();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        term.dispose();
        window.removeEventListener('resize', handleResize);
      };
    };

    loadTerminal();
  }, []);

  useEffect(() => {
    if (!terminal) return;

    terminal.onKey(({ key, domEvent }) => {
      const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

      if (domEvent.keyCode === 13) { // Enter key
        terminal.write('\r\n');
        handleCommand(terminal, terminal.buffer.active.getLine(terminal.buffer.active.baseY + terminal.buffer.active.cursorY)!.translateToString());
      } else if (domEvent.keyCode === 8) { // Backspace
        if (terminal.buffer.active.cursorX > PROMPT.length) {
          terminal.write('\b \b');
        }
      } else if (printable) {
        terminal.write(key);
      }
    });
  }, [terminal]);

  const handleCommand = (term: XTerminal, command: string) => {
    const cmd = command.trim().slice(PROMPT.length);
    switch (cmd.toLowerCase()) {
      case 'help':
        term.writeln('Available commands: help, clear, echo, ls, cd, pwd');
        break;
      case 'clear':
        term.clear();
        break;
      case 'ls':
        term.writeln('Documents\nDownloads\nPictures\nMusic\nVideos');
        break;
      case 'cd':
        term.writeln('Changed directory (simulated)');
        break;
      case 'pwd':
        term.writeln('/Users/devon/Desktop');
        break;
      default:
        if (cmd.toLowerCase().startsWith('echo ')) {
          term.writeln(cmd.slice(5));
        } else if (cmd !== '') {
          term.writeln(`Command not found: ${cmd}`);
        }
    }
    term.write(PROMPT);
  };

  return <div ref={terminalRef} className="h-full min-h-[200px]" />;
}