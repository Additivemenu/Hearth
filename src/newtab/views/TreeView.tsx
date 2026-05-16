import { useMemo } from 'react'
import { useTabsStore } from '../../store/tabsStore'
import { BoardLayout } from '../components/BoardLayout'
import { groupByTree } from '../grouping/byTree'
import { applyOrder, type TabInfo } from '../tabs'

type Props = {
  tabs: TabInfo[]
}

export function TreeView({ tabs }: Props) {
  const openerMap = useTabsStore((s) => s.openerMap)
  const order = useTabsStore((s) => s.groupOrder.tree)

  const groups = useMemo(
    () => applyOrder(groupByTree(tabs, openerMap), order),
    [tabs, openerMap, order],
  )

  return <BoardLayout groups={groups} mode="tree" />
}
