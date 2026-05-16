import confetti from 'canvas-confetti'
import { CornerDownRight, Pin, Volume2, X } from 'lucide-react'
import { useTabsStore } from '../../store/tabsStore'
import { hostnameOf, type TabInfo } from '../tabs'

const REWARD_COLORS = ['#f97316', '#fb7185', '#fcd34d', '#f472b6']

function burstReward(button: HTMLElement) {
  const rect = button.getBoundingClientRect()
  confetti({
    particleCount: 24,
    spread: 55,
    startVelocity: 25,
    gravity: 0.9,
    ticks: 90,
    scalar: 0.75,
    origin: {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    },
    colors: REWARD_COLORS,
    disableForReducedMotion: true,
  })
}

type Props = {
  tab: TabInfo
  depth?: number
}

const INDENT_PX = 16
const BASE_PX = 12

export function TabRow({ tab, depth = 0 }: Props) {
  const activate = useTabsStore((s) => s.activate)
  const close = useTabsStore((s) => s.close)

  const indentStyle =
    depth > 0 ? { paddingLeft: BASE_PX + depth * INDENT_PX } : undefined

  return (
    <li
      className="group/row relative flex items-center gap-3 px-3 py-2 transition-colors hover:bg-surface-hover/70"
      style={indentStyle}
    >
      {tab.active && (
        <span
          className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-brand"
          aria-hidden
        />
      )}

      {depth > 0 && (
        <CornerDownRight
          className="h-3 w-3 shrink-0 text-fg-subtle/60"
          aria-hidden
        />
      )}

      <div className="relative shrink-0">
        {tab.favIconUrl ? (
          <img src={tab.favIconUrl} alt="" className="h-4 w-4 rounded-sm" />
        ) : (
          <span className="block h-4 w-4 rounded-sm bg-line" />
        )}
      </div>

      <button
        onClick={() => activate(tab)}
        className="min-w-0 flex-1 text-left"
        title={tab.url}
      >
        <span className="block truncate text-sm text-fg">{tab.title}</span>
        <span className="block truncate text-[11px] text-fg-muted">
          {hostnameOf(tab.url)}
        </span>
      </button>

      <div className="flex shrink-0 items-center gap-1.5 text-fg-subtle">
        {tab.audible && (
          <Volume2 className="h-3.5 w-3.5 text-brand" aria-label="Audible" />
        )}
        {tab.pinned && (
          <Pin className="h-3.5 w-3.5 text-brand" aria-label="Pinned" />
        )}
      </div>

      <button
        onClick={(e) => {
          burstReward(e.currentTarget)
          void close(tab)
        }}
        aria-label="Close tab"
        className="shrink-0 rounded-md p-1 text-fg-subtle opacity-0 transition-all hover:bg-brand-soft hover:text-brand-soft-fg group-hover/row:opacity-100 focus:opacity-100 active:scale-90"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </li>
  )
}
