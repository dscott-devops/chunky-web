'use client';

import type { PeopleMeta } from '@/lib/api';

interface PaginationProps {
  meta: PeopleMeta;
  search?: string;
  category?: string;
}

export default function BrowsePagination({ meta, search, category }: PaginationProps) {
  const { page, pages } = meta;
  if (pages <= 1) return null;

  function href(p: number) {
    const q = new URLSearchParams();
    if (search) q.set('search', search);
    if (category) q.set('category', category);
    q.set('page', String(p));
    return `/browse?${q}`;
  }

  const pageNums: (number | '…')[] = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || (i >= page - 2 && i <= page + 2)) {
      pageNums.push(i);
    } else if (pageNums[pageNums.length - 1] !== '…') {
      pageNums.push('…');
    }
  }

  return (
    <nav className="flex justify-center gap-1 mt-10" aria-label="Pagination">
      {page > 1 && (
        <a href={href(page - 1)} className="px-3 py-1.5 rounded border border-border text-sm hover:border-primary hover:text-primary transition-colors">
          ‹ Prev
        </a>
      )}
      {pageNums.map((n, i) =>
        n === '…' ? (
          <span key={`ellipsis-${i}`} className="px-3 py-1.5 text-sm text-muted">…</span>
        ) : (
          <a
            key={n}
            href={href(n)}
            className={`px-3 py-1.5 rounded border text-sm transition-colors ${n === page ? 'bg-primary text-white border-primary' : 'border-border hover:border-primary hover:text-primary'}`}
          >
            {n}
          </a>
        )
      )}
      {page < pages && (
        <a href={href(page + 1)} className="px-3 py-1.5 rounded border border-border text-sm hover:border-primary hover:text-primary transition-colors">
          Next ›
        </a>
      )}
    </nav>
  );
}
