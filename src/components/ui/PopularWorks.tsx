import Image from 'next/image';
import type { PopularWork } from '@/lib/api';

export default function PopularWorks({ works }: { works: PopularWork[] }) {
  if (!works.length) return null;

  return (
    <div>
      <h3 className="font-semibold text-sm text-muted uppercase tracking-wider mb-3">Popular Works</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {works.map((work, i) => {
          const year = work.published_at ? new Date(work.published_at).getFullYear() : null;
          const key = work.rank ?? i;
          const inner = (
            <>
              <div className="aspect-[2/3] bg-surface rounded-lg overflow-hidden border border-border">
                {work.thumbnail_url ? (
                  <Image
                    src={work.thumbnail_url}
                    alt={work.title}
                    width={200}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted p-2 text-center">
                    {work.title}
                  </div>
                )}
              </div>
              <p className="text-xs font-medium leading-snug line-clamp-2">{work.title}</p>
              <p className="text-xs text-muted">{year ?? ''}</p>
            </>
          );
          return work.url ? (
            <a key={key} href={work.url} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-1 hover:opacity-80 transition-opacity">
              {inner}
            </a>
          ) : (
            <div key={key} className="flex flex-col gap-1">{inner}</div>
          );
        })}
      </div>
    </div>
  );
}
