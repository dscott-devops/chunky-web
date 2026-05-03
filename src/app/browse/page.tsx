'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PersonCard from '@/components/ui/PersonCard';
import BrowsePagination from './BrowsePagination';
import { api, type Category, type PeopleResponse } from '@/lib/api';
import { cache } from '@/lib/db';

function BrowseContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') ?? undefined;
  const category = searchParams.get('category') ?? undefined;
  const page = Number(searchParams.get('page') ?? '1');
  const limit = 24;

  const [categories, setCategories] = useState<Category[]>([]);
  const [result, setResult] = useState<PeopleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const key = JSON.stringify({ search, category, page, limit });

    async function load() {
      try {
        const cached = await (search ? cache.getSearch(key) : cache.getBrowse(key));
        if (cached && !cancelled) {
          setResult(cached);
          setLoading(false);
          return;
        }
        const data = await api.getPeople({ search, category, page, limit });
        if (!cancelled) {
          if (search) await cache.setSearch(key, data);
          else await cache.setBrowse(key, data);
          setResult(data);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [search, category, page]);

  const title = search
    ? `Search: "${search}"`
    : category
    ? category.charAt(0).toUpperCase() + category.slice(1) + 's'
    : 'Browse People';

  function catHref(cat?: string) {
    const q = new URLSearchParams();
    if (cat) q.set('category', cat);
    return `/browse/?${q}`;
  }

  return (
    <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
      <div className="flex flex-wrap gap-2 mb-6">
        <a
          href="/browse/"
          className={`px-3 py-1 rounded-full border text-sm transition-colors capitalize ${!category ? 'bg-primary text-white border-primary' : 'border-border hover:border-primary hover:text-primary'}`}
        >
          All
        </a>
        {categories.map((c) => (
          <a
            key={c.category}
            href={`/browse/?category=${c.category}`}
            className={`px-3 py-1 rounded-full border text-sm transition-colors capitalize ${category === c.category ? 'bg-primary text-white border-primary' : 'border-border hover:border-primary hover:text-primary'}`}
          >
            {c.category}
          </a>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">{title}</h1>
        {result && <span className="text-sm text-muted">{result.meta.total.toLocaleString()} people</span>}
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-xl bg-surface animate-pulse" />
          ))}
        </div>
      )}

      {error && <p className="text-center text-muted py-20">{error}</p>}

      {result && !loading && (
        <>
          {result.data.length === 0 ? (
            <p className="text-center text-muted py-20">No results found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {result.data.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          )}
          <BrowsePagination meta={result.meta} search={search} category={category} />
        </>
      )}
    </main>
  );
}

export default function BrowsePage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <main className="flex-1 flex items-center justify-center py-20">
            <p className="text-muted">Loading...</p>
          </main>
        }
      >
        <BrowseContent />
      </Suspense>
      <Footer />
    </>
  );
}
