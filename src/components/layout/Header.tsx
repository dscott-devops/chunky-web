'use client';

import Link from 'next/link';
import { useState } from 'react';
import SearchBar from '@/components/ui/SearchBar';

export default function Header() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link href="/" className="font-bold text-xl text-primary shrink-0">
          ChunkyWho
        </Link>
        <div className="flex-1 hidden sm:block max-w-lg">
          <SearchBar />
        </div>
        <button
          className="sm:hidden ml-auto text-muted"
          onClick={() => setMobileSearchOpen((v) => !v)}
          aria-label="Toggle search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </button>
        <nav className="hidden sm:flex items-center gap-4 text-sm text-muted shrink-0">
          <Link href="/browse" className="hover:text-primary transition-colors">Browse</Link>
        </nav>
      </div>
      {mobileSearchOpen && (
        <div className="sm:hidden px-4 pb-3">
          <SearchBar autoFocus onSelect={() => setMobileSearchOpen(false)} />
        </div>
      )}
    </header>
  );
}
