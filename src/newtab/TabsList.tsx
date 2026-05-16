import { useEffect, useMemo } from 'react'
import { useTabsStore } from '../store/tabsStore'
import { FilterBar } from './FilterBar'
import { GroupModeToggle } from './GroupModeToggle'
import { SearchBar } from './SearchBar'
import { TabGroupSection } from './TabGroupSection'
import { filterTabs, groupTabs } from './tabs'

export function TabsList() {
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
  const groups = useMemo(
    () => groupTabs(filtered, mode, currentWindowId),
    [filtered, mode, currentWindowId],
  )

  const isFiltered = filtered.length !== tabs.length
  const showHeader = mode !== 'none'

  return (
    <div className="flex flex-col gap-5">
      <SearchBar />

      <div className="flex flex-wrap items-center gap-3">
        <FilterBar />
        <div className="ml-auto">
          <GroupModeToggle />
        </div>
      </div>

      <div className="text-xs text-stone-500">
        {isFiltered
          ? `${filtered.length} of ${tabs.length} tabs`
          : `${tabs.length} tabs open`}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-200 bg-white/40 px-4 py-8 text-center text-sm text-stone-500">
          {tabs.length === 0
            ? 'No tabs open.'
            : 'No tabs match the current filter.'}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {groups.map((group) => (
            <TabGroupSection
              key={group.key}
              group={group}
              showHeader={showHeader}
            />
          ))}
        </div>
      )}
    </div>
  )
}
