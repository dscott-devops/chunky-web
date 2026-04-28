import type { Platform } from '@/lib/api';

const PLATFORM_LABELS: Record<string, string> = {
  spotify: 'Spotify',
  deezer: 'Deezer',
  apple_music: 'Apple Music',
  tidal: 'Tidal',
  soundcloud: 'SoundCloud',
  bandcamp: 'Bandcamp',
  youtube: 'YouTube',
  amazon_music: 'Amazon Music',
  imdb: 'IMDb',
  tmdb: 'TMDB',
  musicbrainz: 'MusicBrainz',
};

const HIDDEN_PLATFORMS = new Set(['musicbrainz', 'tmdb']);

export default function PlatformBadges({ platforms }: { platforms: Platform[] }) {
  const visible = platforms.filter((p) => !HIDDEN_PLATFORMS.has(p.platform) && p.platform_url);
  if (!visible.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map(({ platform, platform_url }) => (
        <a
          key={platform}
          href={platform_url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 text-xs font-medium bg-surface border border-border rounded-full hover:border-primary hover:text-primary transition-colors"
        >
          {PLATFORM_LABELS[platform] ?? platform}
        </a>
      ))}
    </div>
  );
}
