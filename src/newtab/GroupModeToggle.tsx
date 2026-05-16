import { useTabsStore } from '../store/tabsStore'
import type { GroupMode } from './tabs'

const MODES: { value: GroupMode; label: string }[] = [
  { value: 'none', label: 'List' },
  { value: 'window', label: 'Window' },
  { value: 'domain', label: 'Domain' },
  { value: 'tree', label: 'Tree' },
]

export function GroupModeToggle() {
  const mode = useTabsStore((s) => s.mode)
  const setMode = useTabsStore((s) => s.setMode)

  return (
    <div className="inline-flex rounded-lg border border-line bg-muted/70 p-0.5">
      {MODES.map((m) => {
        const active = mode === m.value
        return (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            className={
              'rounded-md px-2.5 py-1 text-xs transition-all ' +
              (active
                ? 'bg-surface text-fg shadow-sm'
                : 'text-fg-muted hover:text-fg')
            }
          >
            {m.label}
          </button>
        )
      })}
    </div>
  )
}
