import type { TabGroup, TabInfo } from '../tabs'

export function groupByWindow(
  tabs: TabInfo[],
  currentWindowId: number | null,
): TabGroup[] {
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
