'use client';

import { useState, useEffect } from 'react';
import { api, type Person } from '@/lib/api';
import { cache } from '@/lib/db';

export function useCachedPerson(slug: string) {
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const cached = await cache.getPerson(slug);
        if (cached && !cancelled) {
          setPerson(cached);
          setLoading(false);
          return;
        }
        const data = await api.getPerson(slug);
        if (!cancelled) {
          await cache.setPerson(slug, data);
          setPerson(data);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [slug]);

  return { person, loading, error };
}
