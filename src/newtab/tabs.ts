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

export function groupTabs(
  tabs: TabInfo[],
  mode: GroupMode,
  currentWindowId: number | null,
  openerMap: ReadonlyMap<number, number> = new Map(),
): TabGroup[] {
  if (mode === 'none') {
    return [{ key: 'all', label: `All tabs`, tabs }]
  }

  if (mode === 'window') {
    const byWindow = new Map<number, TabInfo[]>()
    for (const t of tabs) {
      const arr = byWindow.get(t.windowId) ?? []
      arr.push(t)
      byWindow.set(t.windowId, arr)
    }
    return [...byWindow.entries()]
      .sort(([a], [b]) => {
        if (a === currentWindowId) return -1
        if (b === currentWindowId) return 1
        return a - b
      })
      .map(([id, list], i) => ({
        key: `w-${id}`,
        label:
          id === currentWindowId
            ? `Window ${i + 1} · current`
            : `Window ${i + 1}`,
        tabs: list,
      }))
  }

  if (mode === 'tree') {
    return groupTabsAsTree(tabs, openerMap)
  }

  const byDomain = new Map<string, TabInfo[]>()
  for (const t of tabs) {
    const host = hostnameOf(t.url)
    const arr = byDomain.get(host) ?? []
    arr.push(t)
    byDomain.set(host, arr)
  }
  return [...byDomain.entries()]
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
    .map(([host, list]) => ({ key: `d-${host}`, label: host, tabs: list }))
}

function groupTabsAsTree(
  tabs: TabInfo[],
  openerMap: ReadonlyMap<number, number>,
): TabGroup[] {
  const byId = new Map(tabs.map((t) => [t.id, t]))
  const childrenMap = new Map<number, TabInfo[]>()
  const naturalRoots: TabInfo[] = []

  for (const tab of tabs) {
    // Prefer our captured map: it persists relationships even after the
    // parent tab closes (Chrome clears `openerTabId` in that case).
    const parentId = openerMap.get(tab.id) ?? tab.openerTabId
    if (parentId !== undefined && byId.has(parentId)) {
      const arr = childrenMap.get(parentId) ?? []
      arr.push(tab)
      childrenMap.set(parentId, arr)
    } else {
      naturalRoots.push(tab)
    }
  }

  const visited = new Set<number>()
  const groups: TabGroup[] = []

  const buildGroup = (root: TabInfo): TabGroup => {
    const flat: TabInfo[] = []
    const depths = new Map<number, number>()
    const stack: Array<{ node: TabInfo; depth: number }> = [
      { node: root, depth: 0 },
    ]

    while (stack.length) {
      const frame = stack.pop()
      if (!frame) break
      const { node, depth } = frame
      if (visited.has(node.id)) continue
      visited.add(node.id)
      flat.push(node)
      depths.set(node.id, depth)
      const children = childrenMap.get(node.id) ?? []
      // Push in reverse so siblings are popped in original (left-to-right) order.
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push({ node: children[i], depth: depth + 1 })
      }
    }

    return {
      key: `t-${root.id}`,
      label: root.title || hostnameOf(root.url),
      tabs: flat,
      depths,
    }
  }

  for (const root of naturalRoots) {
    groups.push(buildGroup(root))
  }

  // Adopt any tabs unreachable from natural roots (cycles, weird states) as roots.
  for (const tab of tabs) {
    if (!visited.has(tab.id)) {
      groups.push(buildGroup(tab))
    }
  }

  groups.sort((a, b) => b.tabs.length - a.tabs.length)
  return groups
}
