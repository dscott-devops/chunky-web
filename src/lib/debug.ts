'use client';

const STORAGE_KEY = 'chunky_debug';

export function isDebugEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  if (new URLSearchParams(window.location.search).has('debug')) {
    localStorage.setItem(STORAGE_KEY, '1');
    return true;
  }
  return localStorage.getItem(STORAGE_KEY) === '1';
}

export function setDebugEnabled(on: boolean) {
  if (typeof window === 'undefined') return;
  if (on) localStorage.setItem(STORAGE_KEY, '1');
  else localStorage.removeItem(STORAGE_KEY);
}

type Level = 'info' | 'warn' | 'error';
export interface DebugEntry {
  time: string;
  level: Level;
  msg: string;
  data?: unknown;
}

class DebugStore {
  private _entries: DebugEntry[] = [];
  private _subs: Array<() => void> = [];

  log(level: Level, msg: string, data?: unknown) {
    const entry: DebugEntry = {
      time: new Date().toTimeString().slice(0, 8),
      level,
      msg,
      data,
    };
    this._entries.push(entry);
    if (isDebugEnabled()) {
      const args: unknown[] = [`[chunky:${level}] ${msg}`];
      if (data !== undefined) args.push(data);
      if (level === 'error') console.error(...args);
      else if (level === 'warn') console.warn(...args);
      else console.log(...args);
    }
    this._subs.forEach((fn) => fn());
  }

  info(msg: string, data?: unknown) { this.log('info', msg, data); }
  warn(msg: string, data?: unknown) { this.log('warn', msg, data); }
  error(msg: string, data?: unknown) { this.log('error', msg, data); }

  entries() { return this._entries; }
  clear() { this._entries = []; this._subs.forEach((fn) => fn()); }

  subscribe(fn: () => void) {
    this._subs.push(fn);
    return () => { this._subs = this._subs.filter((s) => s !== fn); };
  }
}

export const dbg = new DebugStore();
