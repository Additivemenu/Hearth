import { hostnameOf, type TabGroup, type TabInfo } from '../tabs'

export function groupByTree(
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
