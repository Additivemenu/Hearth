import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChevronRight, GripVertical } from 'lucide-react'
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

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: group.key, disabled: !showHeader })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <section
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'opacity-60' : ''}
    >
      {showHeader && (
        <div className="group/section mb-1.5 flex items-center gap-1.5">
          <button
            {...attributes}
            {...listeners}
            aria-label="Drag to reorder group"
            className="cursor-grab rounded text-fg-subtle/50 transition-all hover:text-fg group-hover/section:text-fg-subtle active:cursor-grabbing"
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => toggleCollapsed(group.key)}
            className="flex flex-1 items-center gap-2 text-left text-[11px] font-medium uppercase tracking-wider text-fg-muted transition-colors hover:text-fg"
          >
            <ChevronRight
              className={
                'h-3 w-3 transition-transform ' +
                (isCollapsed ? '' : 'rotate-90')
              }
              aria-hidden
            />
            <span>{group.label}</span>
            <span className="text-line">·</span>
            <span className="text-fg-muted">{group.tabs.length}</span>
          </button>
        </div>
      )}
      {!isCollapsed && (
        <ul className="divide-y divide-muted overflow-hidden rounded-xl border border-line/70 bg-surface/70">
          {group.tabs.map((tab) => (
            <TabRow key={tab.id} tab={tab} />
          ))}
        </ul>
      )}
    </section>
  )
}
