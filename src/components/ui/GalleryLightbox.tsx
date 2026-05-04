'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import type { GalleryImage } from '@/lib/api';

export default function GalleryLightbox({ images }: { images: GalleryImage[] }) {
  const [selected, setSelected] = useState<number | null>(null);

  const close = useCallback(() => setSelected(null), []);
  const prev = useCallback(() => setSelected(i => i !== null ? (i - 1 + images.length) % images.length : null), [images.length]);
  const next = useCallback(() => setSelected(i => i !== null ? (i + 1) % images.length : null), [images.length]);

  useEffect(() => {
    if (selected === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, close, prev, next]);

  const img = selected !== null ? images[selected] : null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((image, i) => (
          <button
            key={image.commons_file ?? i}
            onClick={() => setSelected(i)}
            className="rounded-xl overflow-hidden border border-border aspect-video bg-surface hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer"
          >
            {image.cloudfront_url ? (
              <Image
                src={image.cloudfront_url}
                alt={image.description ?? ''}
                width={image.width ?? 400}
                height={image.height ?? 225}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted">No image</div>
            )}
          </button>
        ))}
      </div>

      {selected !== null && img && (
        // overflow-y-auto + m-auto: modal scrolls on small screens instead of centering off-screen
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-4 flex"
          onClick={close}
        >
          <div
            className="relative bg-card rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl m-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={close}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 text-white text-xl leading-none flex items-center justify-center hover:bg-black/80"
              aria-label="Close"
            >
              ×
            </button>

            {/* Image capped at 50vh so caption always visible in viewport without scrolling */}
            <div className="relative w-full bg-black" style={{ height: 'clamp(200px, 50vh, 540px)' }}>
              <Image
                src={img.cloudfront_url!}
                alt={img.description ?? ''}
                fill
                className="object-contain"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white text-2xl flex items-center justify-center hover:bg-black/80"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white text-2xl flex items-center justify-center hover:bg-black/80"
                    aria-label="Next image"
                  >
                    ›
                  </button>
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-white/70 bg-black/40 px-2 py-0.5 rounded-full pointer-events-none">
                    {selected + 1} / {images.length}
                  </span>
                </>
              )}
            </div>

            <div className="px-4 py-3 border-t border-border flex flex-col gap-1">
              {img.description && (
                <p className="text-sm leading-snug">{img.description}</p>
              )}
              <p className="text-xs text-muted">
                <span className="text-text">Picture by: </span><span className="font-medium text-text">{img.attribution ?? 'Unknown'}</span>
                {img.license_short && (
                  img.license_url
                    ? <> &middot; <a href={img.license_url} target="_blank" rel="noopener noreferrer" className="hover:underline">{img.license_short}</a></>
                    : <> &middot; {img.license_short}</>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
