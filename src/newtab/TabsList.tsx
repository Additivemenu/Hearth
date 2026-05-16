import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useEffect, useMemo } from 'react'
import { useTabsStore } from '../store/tabsStore'
import { FilterBar } from './FilterBar'
import { GroupModeToggle } from './GroupModeToggle'
import { SearchBar } from './SearchBar'
import { TabGroupSection } from './TabGroupSection'
import { applyOrder, filterTabs, groupTabs } from './tabs'

export function TabsList() {
  const loadTabs = useTabsStore((s) => s.loadTabs)
  const subscribe = useTabsStore((s) => s.subscribeToChromeEvents)

  const tabs = useTabsStore((s) => s.tabs)
  const filters = useTabsStore((s) => s.filters)
  const currentWindowId = useTabsStore((s) => s.currentWindowId)
  const mode = useTabsStore((s) => s.mode)
  const groupOrder = useTabsStore((s) => s.groupOrder)
  const setGroupOrder = useTabsStore((s) => s.setGroupOrder)

  useEffect(() => {
    void loadTabs()
    return subscribe()
  }, [loadTabs, subscribe])

  const filtered = useMemo(
    () => filterTabs(tabs, filters, currentWindowId),
    [tabs, filters, currentWindowId],
  )
  const groups = useMemo(
    () =>
      applyOrder(
        groupTabs(filtered, mode, currentWindowId),
        groupOrder[mode],
      ),
    [filtered, mode, currentWindowId, groupOrder],
  )

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const keys = groups.map((g) => g.key)
    const oldIndex = keys.indexOf(active.id as string)
    const newIndex = keys.indexOf(over.id as string)
    if (oldIndex < 0 || newIndex < 0) return
    setGroupOrder(mode, arrayMove(keys, oldIndex, newIndex))
  }

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={groups.map((g) => g.key)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-4">
              {groups.map((group) => (
                <TabGroupSection
                  key={group.key}
                  group={group}
                  showHeader={showHeader}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
