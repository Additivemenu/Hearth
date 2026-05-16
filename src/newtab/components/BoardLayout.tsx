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
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { useTabsStore } from '../../store/tabsStore'
import type { GroupMode, TabGroup } from '../tabs'
import { TabColumn } from './TabColumn'

type Props = {
  groups: TabGroup[]
  mode: GroupMode
}

export function BoardLayout({ groups, mode }: Props) {
  const setGroupOrder = useTabsStore((s) => s.setGroupOrder)

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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={groups.map((g) => g.key)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="-mx-2 flex items-start gap-4 overflow-x-auto px-2 pb-3">
          {groups.map((group) => (
            <TabColumn key={group.key} group={group} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
