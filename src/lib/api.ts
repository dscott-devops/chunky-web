const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://w.chunkyapi.com";
const API_PATH = "/who";

export type Category = {
  category: string;
  count: string | number;
};

export type PersonSummary = {
  id: number;
  slug: string;
  full_name: string;
  image_url: string | null;
  birth_year: number | null;
  death_year: number | null;
  category: string | null;
};

export type Platform = {
  platform: string;
  platform_id: string;
  platform_url: string;
  verified?: boolean;
};

export type SocialLink = {
  platform: string;
  url: string;
};

export type PopularWork = {
  title: string;
  work_type: string;
  published_at: string | null;
  thumbnail_url: string | null;
  url: string | null;
  rank: number;
};

export type GalleryImage = {
  id: number;
  url: string;
  caption: string | null;
  attribution: string | null;
};

export type Person = PersonSummary & {
  bio: string | null;
  subcategory: string | null;
  nationality: string | null;
  data_quality: number | null;
  platforms: Platform[];
  social_links: SocialLink[];
  popular_works: PopularWork[];
  gallery: GalleryImage[];
};

export type PeopleMeta = {
  page: number;
  per_page: number;
  total: number;
  pages: number;
};

export type PeopleResponse = {
  data: PersonSummary[];
  meta: PeopleMeta;
};

export type AutocompleteResult = {
  id: number;
  slug: string;
  full_name: string;
  image_url: string | null;
  category: string | null;
  birth_year: number | null;
  death_year: number | null;
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${API_PATH}${path}`;
  const res = await fetch(url, { ...init, next: { revalidate: 3600 } });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? `API error ${res.status}`);
  }
  return res.json();
}

export const api = {
  getCategories(): Promise<Category[]> {
    return apiFetch("/categories");
  },

  getPeople(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }): Promise<PeopleResponse> {
    const q = new URLSearchParams();
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    if (params.search) q.set("search", params.search);
    if (params.category) q.set("category", params.category);
    return apiFetch(`/people?${q}`);
  },

  getPerson(slug: string): Promise<Person> {
    return apiFetch(`/people/${slug}`);
  },

  getGallery(slug: string): Promise<GalleryImage[]> {
    return apiFetch(`/people/${slug}/gallery`);
  },

  autocomplete(q: string, opts?: { limit?: number; category?: string }): Promise<AutocompleteResult[]> {
    const params = new URLSearchParams({ q });
    if (opts?.limit) params.set("limit", String(opts.limit));
    if (opts?.category) params.set("category", opts.category);
    return apiFetch(`/autocomplete?${params}`);
  },

  getByPlatform(platform: string, id: string): Promise<Person> {
    return apiFetch(`/platform/${platform}/${id}`);
  },
};
