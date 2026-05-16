import { apiClient } from '../apiClient'
import type { GroupMode } from '../newtab/tabs'
import { useTabsStore } from '../store/tabsStore'

/*
 * Glue between the pure store and the swappable apiClient.
 * To persist a new slice: add a hydrate read here, then a subscribe.
 * The store stays pure; nothing in src/store/* should import apiClient.
 */

const PREFS = 'preferences'
const KEY_GROUP_ORDER = 'groupOrder'

type StoredGroupOrder = Record<GroupMode, string[]>

let initialized = false

export async function initPersistence(): Promise<void> {
  if (initialized) return
  initialized = true

  try {
    const stored = await apiClient.get<Partial<StoredGroupOrder>>(
      PREFS,
      KEY_GROUP_ORDER,
    )
    if (stored) {
      // Merge — never replace. Stored data may be from an older schema (e.g.
      // missing a newly-added GroupMode key). Defaults from initial state fill
      // any gaps.
      useTabsStore.setState((s) => ({
        groupOrder: { ...s.groupOrder, ...stored },
      }))
    }
  } catch (err) {
    console.warn('[hearth] failed to hydrate preferences', err)
  }

  useTabsStore.subscribe(
    (s) => s.groupOrder,
    (groupOrder) => {
      apiClient.set(PREFS, KEY_GROUP_ORDER, groupOrder).catch((err) => {
        console.warn('[hearth] failed to persist groupOrder', err)
      })
    },
  )
}
