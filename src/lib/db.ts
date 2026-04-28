'use client';

import Dexie, { type EntityTable } from 'dexie';
import type { Person, PeopleResponse, AutocompleteResult } from './api';

const TTL_PERSON = 24 * 60 * 60 * 1000;    // 24h
const TTL_BROWSE = 6 * 60 * 60 * 1000;     // 6h
const TTL_SEARCH = 60 * 60 * 1000;         // 1h
const TTL_AUTOCOMPLETE = 5 * 60 * 1000;    // 5min

type CachedPerson = { slug: string; data: Person; cachedAt: number };
type CachedBrowse = { key: string; data: PeopleResponse; cachedAt: number };
type CachedSearch = { key: string; data: PeopleResponse; cachedAt: number };
type CachedAutocomplete = { key: string; data: AutocompleteResult[]; cachedAt: number };

class ChunkyDB extends Dexie {
  people!: EntityTable<CachedPerson, 'slug'>;
  browse!: EntityTable<CachedBrowse, 'key'>;
  search!: EntityTable<CachedSearch, 'key'>;
  autocomplete!: EntityTable<CachedAutocomplete, 'key'>;

  constructor() {
    super('chunkywho');
    this.version(1).stores({
      people: 'slug, cachedAt',
      browse: 'key, cachedAt',
      search: 'key, cachedAt',
      autocomplete: 'key, cachedAt',
    });
  }
}

let _db: ChunkyDB | null = null;

function getDB(): ChunkyDB {
  if (!_db) _db = new ChunkyDB();
  return _db;
}

function isStale(cachedAt: number, ttl: number): boolean {
  return Date.now() - cachedAt > ttl;
}

export const cache = {
  async getPerson(slug: string): Promise<Person | null> {
    const db = getDB();
    const row = await db.people.get(slug);
    if (!row || isStale(row.cachedAt, TTL_PERSON)) return null;
    return row.data;
  },

  async setPerson(slug: string, data: Person): Promise<void> {
    await getDB().people.put({ slug, data, cachedAt: Date.now() });
  },

  async getBrowse(key: string): Promise<PeopleResponse | null> {
    const db = getDB();
    const row = await db.browse.get(key);
    if (!row || isStale(row.cachedAt, TTL_BROWSE)) return null;
    return row.data;
  },

  async setBrowse(key: string, data: PeopleResponse): Promise<void> {
    await getDB().browse.put({ key, data, cachedAt: Date.now() });
  },

  async getSearch(key: string): Promise<PeopleResponse | null> {
    const db = getDB();
    const row = await db.search.get(key);
    if (!row || isStale(row.cachedAt, TTL_SEARCH)) return null;
    return row.data;
  },

  async setSearch(key: string, data: PeopleResponse): Promise<void> {
    await getDB().search.put({ key, data, cachedAt: Date.now() });
  },

  async getAutocomplete(key: string): Promise<AutocompleteResult[] | null> {
    const db = getDB();
    const row = await db.autocomplete.get(key);
    if (!row || isStale(row.cachedAt, TTL_AUTOCOMPLETE)) return null;
    return row.data;
  },

  async setAutocomplete(key: string, data: AutocompleteResult[]): Promise<void> {
    await getDB().autocomplete.put({ key, data, cachedAt: Date.now() });
  },
};
