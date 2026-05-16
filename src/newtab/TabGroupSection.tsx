import { ChevronRight } from 'lucide-react'
import { useTabsStore } from '../store/tabsStore'
import { TabRow } from './TabRow'
import type { TabGroup } from './tabs'

type Props = {
  group: TabGroup
  showHeader: boolean
}

export function TabGroupSection({ group, showHeader }: Props) {
  const collapsedSet = useTabsStore((s) => s.collapsed)
  const toggleCollapsed = useTabsStore((s) => s.toggleCollapsed)
  const isCollapsed = collapsedSet.has(group.key)

  return (
    <section>
      {showHeader && (
        <button
          onClick={() => toggleCollapsed(group.key)}
          className="group/header mb-1.5 flex w-full items-center gap-2 text-left text-[11px] font-medium uppercase tracking-wider text-neutral-500 transition-colors hover:text-neutral-200"
        >
          <ChevronRight
            className={
              'h-3 w-3 transition-transform ' +
              (isCollapsed ? '' : 'rotate-90')
            }
            aria-hidden
          />
          <span>{group.label}</span>
          <span className="text-neutral-600">·</span>
          <span className="text-neutral-500">{group.tabs.length}</span>
        </button>
      )}
      {!isCollapsed && (
        <ul className="divide-y divide-white/[0.04] overflow-hidden rounded-lg border border-white/[0.04] bg-neutral-900/40">
          {group.tabs.map((tab) => (
            <TabRow key={tab.id} tab={tab} />
          ))}
        </ul>
      )}
    </section>
  )
}
