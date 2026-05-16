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
    <div className="inline-flex rounded-lg border border-stone-200 bg-stone-100/70 p-0.5">
      {MODES.map((m) => {
        const active = mode === m.value
        return (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            className={
              'rounded-md px-2.5 py-1 text-xs transition-all ' +
              (active
                ? 'bg-white text-stone-800 shadow-sm'
                : 'text-stone-500 hover:text-stone-800')
            }
          >
            {m.label}
          </button>
        )
      })}
    </div>
  )
}
