export type TabInfo = {
  id: number
  title: string
  url: string
  favIconUrl?: string
  windowId: number
  audible: boolean
  pinned: boolean
  active: boolean
  openerTabId?: number
}

export type GroupMode = 'none' | 'window' | 'domain' | 'tree'

export type TabGroup = {
  key: string
  label: string
  tabs: TabInfo[]
  // Only populated for 'tree' mode: tabId -> depth (root = 0).
  depths?: ReadonlyMap<number, number>
}

export type Filters = {
  query: string
  currentWindowOnly: boolean
  audibleOnly: boolean
  pinnedOnly: boolean
  duplicatesOnly: boolean
}

export const EMPTY_FILTERS: Filters = {
  query: '',
  currentWindowOnly: false,
  audibleOnly: false,
  pinnedOnly: false,
  duplicatesOnly: false,
}

export function hostnameOf(url: string): string {
  try {
    const u = new URL(url)
    return u.hostname || u.protocol.replace(':', '')
  } catch {
    return '(other)'
  }
}

export function filterTabs(
  tabs: TabInfo[],
  filters: Filters,
  currentWindowId: number | null,
): TabInfo[] {
  let result = tabs

  if (filters.currentWindowOnly && currentWindowId !== null) {
    result = result.filter((t) => t.windowId === currentWindowId)
  }
  if (filters.audibleOnly) result = result.filter((t) => t.audible)
  if (filters.pinnedOnly) result = result.filter((t) => t.pinned)

  if (filters.duplicatesOnly) {
    const counts = new Map<string, number>()
    for (const t of result) counts.set(t.url, (counts.get(t.url) ?? 0) + 1)
    result = result.filter((t) => (counts.get(t.url) ?? 0) > 1)
  }

  const q = filters.query.trim().toLowerCase()
  if (q) {
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) || t.url.toLowerCase().includes(q),
    )
  }

  return result
}

export function applyOrder(
  groups: TabGroup[],
  order: string[] | undefined,
): TabGroup[] {
  if (!order || order.length === 0) return groups
  const remaining = new Map(groups.map((g) => [g.key, g]))
  const result: TabGroup[] = []
  for (const key of order) {
    const g = remaining.get(key)
    if (g) {
      result.push(g)
      remaining.delete(key)
    }
  }
  for (const g of remaining.values()) result.push(g)
  return result
}
