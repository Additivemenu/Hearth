import { TabRow } from '../components/TabRow'
import type { TabInfo } from '../tabs'

type Props = {
  tabs: TabInfo[]
}

export function ListView({ tabs }: Props) {
  return (
    <ul className="divide-y divide-muted overflow-hidden rounded-xl border border-line/70 bg-surface/70">
      {tabs.map((tab) => (
        <TabRow key={tab.id} tab={tab} />
      ))}
    </ul>
  )
}
