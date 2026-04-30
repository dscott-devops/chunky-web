'use client';

import { useState, useEffect, useCallback } from 'react';
import { isDebugEnabled, setDebugEnabled, dbg, type DebugEntry } from '@/lib/debug';

export default function DebugPanel() {
  const [enabled, setEnabled] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [entries, setEntries] = useState<DebugEntry[]>([]);

  useEffect(() => {
    setEnabled(isDebugEnabled());
    setEntries([...dbg.entries()]);
    return dbg.subscribe(() => setEntries([...dbg.entries()]));
  }, []);

  const toggle = useCallback(() => {
    const next = !enabled;
    setDebugEnabled(next);
    setEnabled(next);
  }, [enabled]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggle();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle]);

  if (!enabled) return null;

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-3 right-3 z-50 bg-black/80 text-green-400 text-xs font-mono px-2 py-1 rounded border border-green-800 hover:bg-black"
      >
        debug ({entries.length})
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 w-[420px] max-h-72 flex flex-col bg-black/95 border-l border-t border-green-900 text-xs font-mono">
      {/* Header bar */}
      <div className="flex items-center justify-between px-2 py-1 bg-black border-b border-green-900 shrink-0">
        <span className="text-green-300 font-bold">ChunkyWho Debug</span>
        <span className="text-gray-500 text-[10px]">Ctrl+Shift+D to toggle</span>
        <div className="flex gap-3 ml-auto">
          <button onClick={() => dbg.clear()} className="text-yellow-500 hover:text-yellow-300">
            clear
          </button>
          <button
            onClick={() => { setDebugEnabled(false); setEnabled(false); }}
            className="text-red-500 hover:text-red-300"
          >
            off
          </button>
          <button onClick={() => setMinimized(true)} className="text-gray-500 hover:text-gray-300">
            —
          </button>
        </div>
      </div>

      {/* Log entries */}
      <div className="overflow-y-auto flex-1 p-2 space-y-0.5">
        {entries.length === 0 && (
          <p className="text-gray-600">No entries yet.</p>
        )}
        {entries.map((e, i) => (
          <div
            key={i}
            className={
              e.level === 'error'
                ? 'text-red-400'
                : e.level === 'warn'
                ? 'text-yellow-400'
                : 'text-green-400'
            }
          >
            <span className="text-gray-600 select-none">{e.time} </span>
            <span>{e.msg}</span>
            {e.data !== undefined && (
              <pre className="text-gray-400 ml-4 text-[10px] whitespace-pre-wrap break-all">
                {typeof e.data === 'string' ? e.data : JSON.stringify(e.data, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
