import { hostnameOf, type TabGroup, type TabInfo } from '../tabs'

export function groupByDomain(tabs: TabInfo[]): TabGroup[] {
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
