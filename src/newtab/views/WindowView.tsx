import { useMemo } from 'react'
import { useTabsStore } from '../../store/tabsStore'
import { BoardLayout } from '../components/BoardLayout'
import { groupByWindow } from '../grouping/byWindow'
import { applyOrder, type TabInfo } from '../tabs'

type Props = {
  tabs: TabInfo[]
}

export function WindowView({ tabs }: Props) {
  const currentWindowId = useTabsStore((s) => s.currentWindowId)
  const order = useTabsStore((s) => s.groupOrder.window)

  const groups = useMemo(
    () => applyOrder(groupByWindow(tabs, currentWindowId), order),
    [tabs, currentWindowId, order],
  )

  return <BoardLayout groups={groups} mode="window" />
}
