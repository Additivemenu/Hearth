export type TabInfo = {
  id: number
  title: string
  url: string
  favIconUrl?: string
  windowId: number
}

export type GroupMode = 'none' | 'window' | 'domain'

export type TabGroup = {
  key: string
  label: string
  tabs: TabInfo[]
}

export function hostnameOf(url: string): string {
  try {
    const u = new URL(url)
    return u.hostname || u.protocol.replace(':', '')
  } catch {
    return '(other)'
  }
}

export function groupTabs(
  tabs: TabInfo[],
  mode: GroupMode,
  currentWindowId: number | null,
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
