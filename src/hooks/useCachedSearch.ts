'use client';

import { useState, useEffect } from 'react';
import { api, type PeopleResponse, type AutocompleteResult } from '@/lib/api';
import { cache } from '@/lib/db';

export function useCachedSearch(params: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}) {
  const [result, setResult] = useState<PeopleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const key = JSON.stringify(params);

  useEffect(() => {
    if (!params.search && !params.category) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function load() {
      try {
        let cached = null;
        try {
          cached = await (params.search ? cache.getSearch(key) : cache.getBrowse(key));
        } catch {}
        if (cached && !cancelled) {
          setResult(cached);
          setLoading(false);
          return;
        }
        const data = await api.getPeople(params);
        if (!cancelled) {
          setResult(data);
          const write = params.search ? cache.setSearch(key, data) : cache.setBrowse(key, data);
          write.catch(() => {});
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [key]);

  return { result, loading, error };
}

export function useAutocomplete(q: string, opts?: { category?: string }) {
  const [results, setResults] = useState<AutocompleteResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    let cancelled = false;
    const key = `${q}|${opts?.category ?? ''}`;

    async function load() {
      setLoading(true);
      try {
        let cached = null;
        try { cached = await cache.getAutocomplete(key); } catch {}
        if (cached && !cancelled) {
          setResults(cached);
          setLoading(false);
          return;
        }
        const data = await api.autocomplete(q, { limit: 8, ...opts });
        if (!cancelled) {
          setResults(data);
          cache.setAutocomplete(key, data).catch(() => {});
        }
      } catch {
        // silent — autocomplete errors shouldn't block UI
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    const timer = setTimeout(load, 200);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [q, opts?.category]);

  return { results, loading };
}
