import { IndexedDBClient } from './indexedDb'
import type { ApiClient } from './types'

export type { ApiClient, Collection } from './types'

// To switch backends, replace this single line (e.g. `new RestClient(...)`).
export const apiClient: ApiClient = new IndexedDBClient()
