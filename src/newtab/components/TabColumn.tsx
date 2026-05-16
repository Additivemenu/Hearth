import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChevronDown, GripVertical } from 'lucide-react'
import { useTabsStore } from '../../store/tabsStore'
import type { TabGroup } from '../tabs'
import { TabRow } from './TabRow'

type Props = {
  group: TabGroup
}

export function TabColumn({ group }: Props) {
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
  } = useSortable({ id: group.key })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <section
      ref={setNodeRef}
      style={style}
      className={
        'flex w-72 shrink-0 flex-col self-start overflow-hidden rounded-xl border border-line/70 bg-surface/70 ' +
        (isDragging ? 'opacity-60 ring-2 ring-brand-border' : '')
      }
    >
      <div className="group/header flex items-center gap-1.5 border-b border-line/60 bg-surface/80 px-3 py-2">
        <button
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder column"
          className="cursor-grab rounded text-fg-subtle/50 transition-all hover:text-fg group-hover/header:text-fg-subtle active:cursor-grabbing"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => toggleCollapsed(group.key)}
          className="flex flex-1 items-center gap-1.5 text-left text-[11px] font-medium uppercase tracking-wider text-fg-muted transition-colors hover:text-fg"
        >
          <ChevronDown
            className={
              'h-3 w-3 transition-transform ' +
              (isCollapsed ? '-rotate-90' : '')
            }
            aria-hidden
          />
          <span className="truncate">{group.label}</span>
          <span className="ml-auto text-fg-subtle">{group.tabs.length}</span>
        </button>
      </div>
      {!isCollapsed && (
        <ul className="divide-y divide-muted">
          {group.tabs.map((tab) => (
            <TabRow
              key={tab.id}
              tab={tab}
              depth={group.depths?.get(tab.id) ?? 0}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
