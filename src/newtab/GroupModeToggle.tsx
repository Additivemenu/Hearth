import { useTabsStore } from '../store/tabsStore'
import type { GroupMode } from './tabs'

const MODES: { value: GroupMode; label: string }[] = [
  { value: 'none', label: 'List' },
  { value: 'window', label: 'Window' },
  { value: 'domain', label: 'Domain' },
]

export function GroupModeToggle() {
  const mode = useTabsStore((s) => s.mode)
  const setMode = useTabsStore((s) => s.setMode)

  return (
    <div className="inline-flex rounded-lg border border-white/5 bg-neutral-900/60 p-0.5">
      {MODES.map((m) => {
        const active = mode === m.value
        return (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            className={
              'rounded-md px-2.5 py-1 text-xs transition-all ' +
              (active
                ? 'bg-neutral-700/80 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200')
            }
          >
            {m.label}
          </button>
        )
      })}
    </div>
  )
}
