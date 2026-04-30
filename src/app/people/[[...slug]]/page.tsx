import PersonClient from './PersonClient';

// Static export: only generate /people/ (the empty-slug shell).
// In production, nginx serves this HTML for all /people/<slug>/ URLs.
// The slug is read from window.location.pathname at runtime by PersonClient.
export function generateStaticParams() {
  return [{ slug: [] as string[] }];
}

export const dynamicParams = false;

export default function PersonPage() {
  return <PersonClient />;
}
