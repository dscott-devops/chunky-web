'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PlatformBadges from '@/components/ui/PlatformBadges';
import PopularWorks from '@/components/ui/PopularWorks';
import { useCachedPerson } from '@/hooks/useCachedPerson';

function PersonContent({ slug }: { slug: string }) {
  const { person, loading, error } = useCachedPerson(slug);

  const years = person?.birth_year
    ? `${person.birth_year}${person.death_year ? `–${person.death_year}` : '–'}`
    : null;

  useEffect(() => {
    if (person) document.title = `${person.full_name} | ChunkyWho`;
  }, [person]);

  if (loading) return (
    <div className="flex flex-col sm:flex-row gap-6 animate-pulse">
      <div className="w-40 sm:w-48 aspect-[3/4] rounded-2xl bg-border/40 shrink-0" />
      <div className="flex-1 space-y-3 pt-2">
        <div className="h-4 bg-border/40 rounded w-24" />
        <div className="h-8 bg-border/40 rounded w-64" />
        <div className="h-4 bg-border/40 rounded w-32" />
        <div className="h-20 bg-border/40 rounded w-full" />
      </div>
    </div>
  );

  if (error) return <p className="text-center text-muted py-20">Person not found.</p>;
  if (!person) return null;

  return (
    <>
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
            <p className="text-sm leading-relaxed text-muted max-w-prose line-clamp-4">{person.bio}</p>
          )}

          {person.social_links?.length > 0 && (
            <div className="flex gap-3">
              {person.social_links.map((link) => (
                <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline capitalize">
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
                <Image src={img.url} alt={img.caption ?? person.full_name} width={400} height={225}
                  className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default function PersonPage() {
  const [slug, setSlug] = useState('');

  useEffect(() => {
    // Extract slug from URL: /people/taylor-swift/ → taylor-swift
    const parts = window.location.pathname.replace(/\/$/, '').split('/');
    setSlug(parts[parts.length - 1]);
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        {slug ? <PersonContent slug={slug} /> : <div className="animate-pulse h-96 bg-border/20 rounded-xl" />}
      </main>
      <Footer />
    </>
  );
}
