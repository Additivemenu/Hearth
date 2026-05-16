import type { TabInfo } from './tabs'

type Props = {
  tab: TabInfo
  onActivate: (tab: TabInfo) => void
  onClose: (tab: TabInfo) => void
}

export function TabRow({ tab, onActivate, onClose }: Props) {
  return (
    <li className="flex items-center gap-3 py-2">
      {tab.favIconUrl ? (
        <img src={tab.favIconUrl} alt="" className="h-4 w-4 shrink-0" />
      ) : (
        <span className="h-4 w-4 shrink-0 rounded bg-neutral-700" />
      )}
      <button
        onClick={() => onActivate(tab)}
        className="min-w-0 flex-1 truncate text-left text-sm hover:text-white"
        title={tab.url}
      >
        {tab.title}
      </button>
      <button
        onClick={() => onClose(tab)}
        className="rounded px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-white"
      >
        Close
      </button>
    </li>
  )
}
