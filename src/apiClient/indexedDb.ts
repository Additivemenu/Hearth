import { openDB, type IDBPDatabase } from 'idb'
import { COLLECTIONS, type ApiClient } from './types'

const DB_NAME = 'hearth'
const DB_VERSION = 1

export class IndexedDBClient implements ApiClient {
  private dbPromise: Promise<IDBPDatabase>

  constructor(dbName: string = DB_NAME, version: number = DB_VERSION) {
    this.dbPromise = openDB(dbName, version, {
      upgrade(db) {
        for (const c of COLLECTIONS) {
          if (!db.objectStoreNames.contains(c)) {
            db.createObjectStore(c)
          }
        }
      },
    })
  }

  async get<T>(collection: string, key: string): Promise<T | null> {
    const db = await this.dbPromise
    const value = await db.get(collection, key)
    return (value ?? null) as T | null
  }

  async set<T>(collection: string, key: string, value: T): Promise<void> {
    const db = await this.dbPromise
    await db.put(collection, value, key)
  }

  async delete(collection: string, key: string): Promise<void> {
    const db = await this.dbPromise
    await db.delete(collection, key)
  }
}
