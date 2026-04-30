'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PlatformBadges from '@/components/ui/PlatformBadges';
import PopularWorks from '@/components/ui/PopularWorks';
import { useCachedPerson } from '@/hooks/useCachedPerson';

function PersonDetail({ slug }: { slug: string }) {
  const { person, loading, error } = useCachedPerson(slug);

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center py-20">
        <p className="text-muted">Loading...</p>
      </main>
    );
  }

  if (error || !person) {
    return (
      <main className="flex-1 flex items-center justify-center py-20">
        <p className="text-muted">{error ?? 'Person not found'}</p>
      </main>
    );
  }

  const years = person.birth_year
    ? `${person.birth_year}${person.death_year ? `–${person.death_year}` : '–'}`
    : null;

  const socialLinks = person.social_links ?? [];

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

          {socialLinks.length > 0 && (
            <div className="flex gap-3">
              {socialLinks.map((link) => (
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
    const s = parts[parts.length - 1];
    setSlug(s || null);
  }, []);

  return (
    <>
      <Header />
      {slug ? (
        <PersonDetail slug={slug} />
      ) : (
        <main className="flex-1 flex items-center justify-center py-20">
          <p className="text-muted">Loading...</p>
        </main>
      )}
      <Footer />
    </>
  );
}
