import Link from 'next/link';
import Image from 'next/image';
import type { PersonSummary } from '@/lib/api';

export default function PersonCard({ person }: { person: PersonSummary }) {
  const years = person.birth_year
    ? `${person.birth_year}${person.death_year ? `–${person.death_year}` : ''}`
    : null;

  return (
    <Link
      href={`/people/${person.slug}`}
      className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:shadow-md hover:border-primary/30 transition-all"
    >
      <div className="aspect-[3/4] bg-surface overflow-hidden">
        {person.image_url ? (
          <Image
            src={person.image_url}
            alt={person.full_name}
            width={300}
            height={400}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-muted/30 font-bold">
            {person.full_name[0]}
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="font-semibold text-sm leading-snug truncate">{person.full_name}</p>
        <p className="text-xs text-muted capitalize mt-0.5">
          {person.category}{years ? ` · ${years}` : ''}
        </p>
      </div>
    </Link>
  );
}
