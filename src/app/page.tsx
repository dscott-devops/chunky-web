import Link from 'next/link';
import { api } from '@/lib/api';
import { siteConfig } from '@/themes';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PersonCard from '@/components/ui/PersonCard';

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    api.getCategories(),
    api.getPeople({ limit: 12 }),
  ]);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-card border-b border-border py-16 px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-text mb-3">{siteConfig.name}</h1>
          <p className="text-lg text-muted max-w-xl mx-auto">{siteConfig.description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <Link
                key={c.category}
                href={`/browse?category=${c.category}`}
                className="px-4 py-2 rounded-full border border-border bg-surface hover:border-primary hover:text-primary text-sm capitalize transition-colors"
              >
                {c.category} <span className="text-muted">({Number(c.count).toLocaleString()})</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured */}
        <section className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Featured People</h2>
            <Link href="/browse" className="text-sm text-primary hover:underline">Browse all →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featured.data.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
