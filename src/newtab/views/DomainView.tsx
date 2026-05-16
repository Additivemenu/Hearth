import { useMemo } from 'react'
import { useTabsStore } from '../../store/tabsStore'
import { BoardLayout } from '../components/BoardLayout'
import { groupByDomain } from '../grouping/byDomain'
import { applyOrder, type TabInfo } from '../tabs'

type Props = {
  tabs: TabInfo[]
}

export function DomainView({ tabs }: Props) {
  const order = useTabsStore((s) => s.groupOrder.domain)

  const groups = useMemo(
    () => applyOrder(groupByDomain(tabs), order),
    [tabs, order],
  )

  return <BoardLayout groups={groups} mode="domain" />
}
