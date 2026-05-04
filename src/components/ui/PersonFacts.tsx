import type { Person } from '@/lib/api';

// Ordered list of infobox keys to display, with fallback aliases and display labels
const FACTS: { keys: string[]; label: string }[] = [
  { keys: ['birth_name'],             label: 'Born' },
  { keys: ['origin'],                 label: 'Birthplace' },
  { keys: ['occupation'],             label: 'Occupation' },
  { keys: ['years_active', 'years active'], label: 'Years active' },
  { keys: ['nationality'],            label: 'Nationality' },
  { keys: ['other_names'],            label: 'Also known as' },
  { keys: ['spouse'],                 label: 'Spouse' },
  { keys: ['partner'],                label: 'Partner' },
  { keys: ['children'],               label: 'Children' },
  { keys: ['parents'],                label: 'Parents' },
  { keys: ['relatives'],              label: 'Relatives' },
];

export default function PersonFacts({ person }: { person: Person }) {
  const box = person.infobox_data ?? {};

  const rows = FACTS.flatMap(({ keys, label }) => {
    const value = keys.map(k => box[k]).find(v => v && v.trim());
    return value ? [{ label, value }] : [];
  });

  if (!rows.length) return null;

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h3 className="font-semibold text-sm text-muted uppercase tracking-wider mb-3">About</h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex flex-col">
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="text-sm">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
