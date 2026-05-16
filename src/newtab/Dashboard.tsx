import { useEffect, useMemo, type ComponentType } from 'react'
import { useTabsStore } from '../store/tabsStore'
import { FilterBar } from './components/FilterBar'
import { GroupModeToggle } from './components/GroupModeToggle'
import { SearchBar } from './components/SearchBar'
import { filterTabs, type GroupMode, type TabInfo } from './tabs'
import { DomainView } from './views/DomainView'
import { ListView } from './views/ListView'
import { TreeView } from './views/TreeView'
import { WindowView } from './views/WindowView'

const VIEWS: Record<GroupMode, ComponentType<{ tabs: TabInfo[] }>> = {
  none: ListView,
  window: WindowView,
  domain: DomainView,
  tree: TreeView,
}

export function Dashboard() {
  const loadTabs = useTabsStore((s) => s.loadTabs)
  const subscribe = useTabsStore((s) => s.subscribeToChromeEvents)

  const tabs = useTabsStore((s) => s.tabs)
  const filters = useTabsStore((s) => s.filters)
  const currentWindowId = useTabsStore((s) => s.currentWindowId)
  const mode = useTabsStore((s) => s.mode)

  useEffect(() => {
    void loadTabs()
    return subscribe()
  }, [loadTabs, subscribe])

  const filtered = useMemo(
    () => filterTabs(tabs, filters, currentWindowId),
    [tabs, filters, currentWindowId],
  )

  const isFiltered = filtered.length !== tabs.length
  const ViewComponent = VIEWS[mode]

  return (
    <div className="flex flex-col gap-5">
      <SearchBar />

      <div className="flex flex-wrap items-center gap-3">
        <FilterBar />
        <div className="ml-auto">
          <GroupModeToggle />
        </div>
      </div>

      <div className="text-xs text-fg-muted">
        {isFiltered
          ? `${filtered.length} of ${tabs.length} tabs`
          : `${tabs.length} tabs open`}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-surface/40 px-4 py-8 text-center text-sm text-fg-muted">
          {tabs.length === 0
            ? 'No tabs open.'
            : 'No tabs match the current filter.'}
        </p>
      ) : (
        <ViewComponent tabs={filtered} />
      )}
    </div>
  )
}
