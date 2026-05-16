/**
 * Backend-agnostic storage contract. Implementations may persist to IndexedDB,
 * chrome.storage, a REST + SQL backend, etc. — the consumer (persistence layer)
 * doesn't care.
 *
 * `collection` maps to: IndexedDB object store / SQL table / REST resource.
 * `key` is the record identifier within that collection.
 *
 * `get` returns null when the record is absent; throws on real failures.
 */
export interface ApiClient {
  get<T>(collection: string, key: string): Promise<T | null>
  set<T>(collection: string, key: string, value: T): Promise<void>
  delete(collection: string, key: string): Promise<void>
}

/**
 * Collections are declared up-front so backends with explicit schemas
 * (IndexedDB object stores, SQL tables) can provision them at init.
 * To add one: bump DB_VERSION in indexedDb.ts and add it here.
 */
export const COLLECTIONS = ['preferences'] as const
export type Collection = (typeof COLLECTIONS)[number]
