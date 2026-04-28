'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAutocomplete } from '@/hooks/useCachedSearch';
import type { AutocompleteResult } from '@/lib/api';

interface SearchBarProps {
  autoFocus?: boolean;
  onSelect?: () => void;
  defaultValue?: string;
}

export default function SearchBar({ autoFocus, onSelect, defaultValue = '' }: SearchBarProps) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const { results } = useAutocomplete(q);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    setOpen(results.length > 0 && q.length >= 2);
    setActiveIdx(-1);
  }, [results, q]);

  function handleSelect(person: AutocompleteResult) {
    setOpen(false);
    setQ('');
    onSelect?.();
    router.push(`/people/${person.slug}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (activeIdx >= 0 && results[activeIdx]) {
      handleSelect(results[activeIdx]);
    } else if (q.trim()) {
      setOpen(false);
      router.push(`/browse?search=${encodeURIComponent(q.trim())}`);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={handleKey}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            onFocus={() => { if (results.length > 0 && q.length >= 2) setOpen(true); }}
            placeholder="Search people…"
            className="w-full h-9 pl-9 pr-3 rounded-md border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <svg className="absolute left-2.5 top-2 h-4 w-4 text-muted pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </div>
      </form>

      {open && (
        <ul
          ref={listRef}
          className="absolute top-full mt-1 w-full bg-card border border-border rounded-md shadow-lg z-50 overflow-hidden max-h-80 overflow-y-auto"
          role="listbox"
        >
          {results.map((person, idx) => (
            <li
              key={person.id}
              role="option"
              aria-selected={idx === activeIdx}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer text-sm ${idx === activeIdx ? 'bg-primary/10' : 'hover:bg-surface'}`}
              onMouseDown={() => handleSelect(person)}
            >
              {person.image_url ? (
                <Image src={person.image_url} alt="" width={32} height={32} className="w-8 h-8 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-border shrink-0" />
              )}
              <div className="min-w-0">
                <p className="font-medium truncate">{person.full_name}</p>
                <p className="text-muted text-xs capitalize">
                  {person.category}{person.birth_year ? ` · ${person.birth_year}` : ''}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
