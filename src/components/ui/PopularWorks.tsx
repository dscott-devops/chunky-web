import Image from 'next/image';
import type { PopularWork } from '@/lib/api';

export default function PopularWorks({ works }: { works: PopularWork[] }) {
  if (!works.length) return null;

  return (
    <div>
      <h3 className="font-semibold text-sm text-muted uppercase tracking-wider mb-3">Popular Works</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {works.map((work) => (
          <div key={work.rank} className="flex flex-col gap-1">
            <div className="aspect-[2/3] bg-surface rounded-lg overflow-hidden border border-border">
              {work.poster_url ? (
                <Image
                  src={work.poster_url}
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
            <p className="text-xs text-muted">{work.year ?? ''}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
