import { Pin, Volume2, X } from 'lucide-react'
import { useTabsStore } from '../store/tabsStore'
import { hostnameOf, type TabInfo } from './tabs'

type Props = {
  tab: TabInfo
}

export function TabRow({ tab }: Props) {
  const activate = useTabsStore((s) => s.activate)
  const close = useTabsStore((s) => s.close)

  return (
    <li className="group/row relative flex items-center gap-3 px-3 py-2 transition-colors hover:bg-orange-50/70">
      {tab.active && (
        <span
          className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-orange-500"
          aria-hidden
        />
      )}

      <div className="relative shrink-0">
        {tab.favIconUrl ? (
          <img src={tab.favIconUrl} alt="" className="h-4 w-4 rounded-sm" />
        ) : (
          <span className="block h-4 w-4 rounded-sm bg-stone-200" />
        )}
      </div>

      <button
        onClick={() => activate(tab)}
        className="min-w-0 flex-1 text-left"
        title={tab.url}
      >
        <span className="block truncate text-sm text-stone-800 group-hover/row:text-stone-900">
          {tab.title}
        </span>
        <span className="block truncate text-[11px] text-stone-500">
          {hostnameOf(tab.url)}
        </span>
      </button>

      <div className="flex shrink-0 items-center gap-1.5 text-stone-400">
        {tab.audible && (
          <Volume2 className="h-3.5 w-3.5 text-orange-500" aria-label="Audible" />
        )}
        {tab.pinned && (
          <Pin className="h-3.5 w-3.5 text-orange-500" aria-label="Pinned" />
        )}
      </div>

      <button
        onClick={() => close(tab)}
        aria-label="Close tab"
        className="shrink-0 rounded-md p-1 text-stone-400 opacity-0 transition-all hover:bg-orange-100 hover:text-orange-700 group-hover/row:opacity-100 focus:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </li>
  )
}
