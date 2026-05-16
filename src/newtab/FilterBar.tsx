import {
  Copy,
  Monitor,
  Pin,
  Volume2,
  type LucideIcon,
} from 'lucide-react'
import { useTabsStore } from '../store/tabsStore'
import type { Filters } from './tabs'

type PillKey = keyof Omit<Filters, 'query'>

const PILLS: { key: PillKey; label: string; icon: LucideIcon }[] = [
  { key: 'currentWindowOnly', label: 'Current window', icon: Monitor },
  { key: 'audibleOnly', label: 'Audible', icon: Volume2 },
  { key: 'pinnedOnly', label: 'Pinned', icon: Pin },
  { key: 'duplicatesOnly', label: 'Duplicates', icon: Copy },
]

export function FilterBar() {
  const filters = useTabsStore((s) => s.filters)
  const togglePill = useTabsStore((s) => s.togglePill)
  const resetFilters = useTabsStore((s) => s.resetFilters)

  const anyActive =
    filters.query.length > 0 || PILLS.some((p) => filters[p.key])

  return (
    <div className="flex flex-wrap items-center gap-2">
      {PILLS.map(({ key, label, icon: Icon }) => {
        const active = filters[key]
        return (
          <button
            key={key}
            onClick={() => togglePill(key)}
            className={
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-all ' +
              (active
                ? 'border-brand-border bg-brand-soft text-brand-soft-fg shadow-[0_1px_0_rgba(255,255,255,0.6)_inset]'
                : 'border-line bg-surface text-fg-muted hover:bg-muted hover:text-fg')
            }
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {label}
          </button>
        )
      })}
      {anyActive && (
        <button
          onClick={resetFilters}
          className="ml-1 text-xs text-fg-muted transition-colors hover:text-brand"
        >
          Reset
        </button>
      )}
    </div>
  )
}
