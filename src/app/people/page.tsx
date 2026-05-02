'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PlatformBadges from '@/components/ui/PlatformBadges';
import PopularWorks from '@/components/ui/PopularWorks';
import { api, type Person, API_BASE, API_PATH } from '@/lib/api';
import { cache } from '@/lib/db';
import { dbg } from '@/lib/debug';

function PersonDetail({ slug }: { slug: string }) {
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      dbg.info(`loading person`, { slug });
      setLoading(true);
      setError(null);

      try {
        const cached = await cache.getPerson(slug);
        if (cached) {
          dbg.info(`cache hit`, { name: cached.full_name });
          if (!cancelled) { setPerson(cached); setLoading(false); }
          return;
        }
        dbg.info(`cache miss — fetching from API`, {
          url: `${API_BASE}${API_PATH}/people/${slug}`,
        });

        const data = await api.getPerson(slug);
        dbg.info(`API OK`, {
          name: data.full_name,
          category: data.category,
          works: data.popular_works?.length ?? 0,
          gallery: data.gallery?.length ?? 0,
        });

        if (!cancelled) {
          await cache.setPerson(slug, data);
          setPerson(data);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        dbg.error(`API error`, { slug, error: msg });
        if (!cancelled) setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        <div className="flex flex-col sm:flex-row gap-6 mb-8 animate-pulse">
          <div className="w-40 sm:w-48 aspect-[3/4] rounded-2xl bg-surface shrink-0" />
          <div className="flex flex-col gap-3 flex-1">
            <div className="h-4 bg-surface rounded w-24" />
            <div className="h-8 bg-surface rounded w-64" />
            <div className="h-4 bg-surface rounded w-40" />
            <div className="h-20 bg-surface rounded w-full max-w-prose" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !person) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-20 gap-2">
        <p className="text-muted text-lg">Person not found</p>
        <p className="text-xs text-muted/60 font-mono">{error ?? 'No data'}</p>
        <a href="/browse/" className="text-sm text-primary hover:underline mt-2">
          Browse all people →
        </a>
      </main>
    );
  }

  const years = person.birth_year
    ? `${person.birth_year}${person.death_year ? `–${person.death_year}` : '–'}`
    : null;

  return (
    <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        <div className="shrink-0">
          {person.image_url ? (
            <Image
              src={person.image_url}
              alt={person.full_name}
              width={200}
              height={267}
              className="w-40 sm:w-48 rounded-2xl object-cover border border-border"
              priority
            />
          ) : (
            <div className="w-40 sm:w-48 aspect-[3/4] rounded-2xl bg-surface border border-border flex items-center justify-center text-5xl font-bold text-muted/30">
              {person.full_name[0]}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 min-w-0">
          <div>
            <p className="text-sm text-muted capitalize">
              {person.category}{person.subcategory ? ` · ${person.subcategory}` : ''}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold mt-0.5">{person.full_name}</h1>
            {years && (
              <p className="text-muted mt-1">
                {years}{person.nationality ? ` · ${person.nationality}` : ''}
              </p>
            )}
          </div>

          {person.bio && (
            <p className="text-sm leading-relaxed text-muted max-w-prose line-clamp-4">
              {person.bio}
            </p>
          )}

          {(person.social_links ?? []).length > 0 && (
            <div className="flex gap-3">
              {person.social_links.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline capitalize"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          )}

          <PlatformBadges platforms={person.platforms ?? []} />
        </div>
      </div>

      {person.popular_works?.length > 0 && (
        <section className="mb-8">
          <PopularWorks works={person.popular_works} />
        </section>
      )}

      {person.gallery?.length > 0 && (
        <section>
          <h3 className="font-semibold text-sm text-muted uppercase tracking-wider mb-3">Gallery</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {person.gallery.map((img) => (
              <div key={img.id} className="rounded-xl overflow-hidden border border-border aspect-video bg-surface">
                <Image
                  src={img.url}
                  alt={img.caption ?? person.full_name}
                  width={400}
                  height={225}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default function PersonPage() {
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    const parts = window.location.pathname.replace(/\/$/, '').split('/');
    // e.g. /people/taylor-swift → ['', 'people', 'taylor-swift'] → 'taylor-swift'
    const raw = parts.slice(2).join('/');
    dbg.info(`URL parsed`, { pathname: window.location.pathname, slug: raw || '(none)' });
    setSlug(raw || null);
  }, []);

  return (
    <>
      <Header />
      {slug ? (
        <PersonDetail slug={slug} />
      ) : (
        <main className="flex-1 flex items-center justify-center py-20">
          <p className="text-muted">No person selected.</p>
        </main>
      )}
      <Footer />
    </>
  );
}
