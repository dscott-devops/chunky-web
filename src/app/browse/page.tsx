import { api } from '@/lib/api';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PersonCard from '@/components/ui/PersonCard';
import BrowsePagination from './BrowsePagination';

interface BrowsePageProps {
  searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const limit = 24;

  const [result, categories] = await Promise.all([
    api.getPeople({ search: params.search, category: params.category, page, limit }),
    api.getCategories(),
  ]);

  const title = params.search
    ? `Search: "${params.search}"`
    : params.category
    ? params.category.charAt(0).toUpperCase() + params.category.slice(1) + 's'
    : 'Browse People';

  return (
    <>
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <a
            href="/browse"
            className={`px-3 py-1 rounded-full border text-sm transition-colors capitalize ${!params.category ? 'bg-primary text-white border-primary' : 'border-border hover:border-primary hover:text-primary'}`}
          >
            All
          </a>
          {categories.map((c) => (
            <a
              key={c.category}
              href={`/browse?category=${c.category}`}
              className={`px-3 py-1 rounded-full border text-sm transition-colors capitalize ${params.category === c.category ? 'bg-primary text-white border-primary' : 'border-border hover:border-primary hover:text-primary'}`}
            >
              {c.category}
            </a>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">{title}</h1>
          <span className="text-sm text-muted">{result.meta.total.toLocaleString()} people</span>
        </div>

        {result.data.length === 0 ? (
          <p className="text-center text-muted py-20">No results found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {result.data.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        )}

        <BrowsePagination meta={result.meta} search={params.search} category={params.category} />
      </main>
      <Footer />
    </>
  );
}
