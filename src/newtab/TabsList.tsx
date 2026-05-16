import { useEffect, useMemo, useState } from 'react'
import { TabRow } from './TabRow'
import {
  EMPTY_FILTERS,
  filterTabs,
  groupTabs,
  type Filters,
  type GroupMode,
  type TabInfo,
} from './tabs'

const GROUP_MODES: { value: GroupMode; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'window', label: 'Window' },
  { value: 'domain', label: 'Domain' },
]

const FILTER_PILLS: { key: keyof Omit<Filters, 'query'>; label: string }[] = [
  { key: 'currentWindowOnly', label: 'Current window' },
  { key: 'audibleOnly', label: 'Audible' },
  { key: 'pinnedOnly', label: 'Pinned' },
  { key: 'duplicatesOnly', label: 'Duplicates' },
]

export function TabsList() {
  const [tabs, setTabs] = useState<TabInfo[]>([])
  const [currentWindowId, setCurrentWindowId] = useState<number | null>(null)
  const [mode, setMode] = useState<GroupMode>('window')
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)

  useEffect(() => {
    const load = async () => {
      const all = await chrome.tabs.query({})
      setTabs(
        all
          .filter((t): t is chrome.tabs.Tab & { id: number } => t.id !== undefined)
          .map((t) => ({
            id: t.id,
            title: t.title ?? t.url ?? '(untitled)',
            url: t.url ?? '',
            favIconUrl: t.favIconUrl,
            windowId: t.windowId,
            audible: t.audible ?? false,
            pinned: t.pinned,
            active: t.active,
          })),
      )
    }
    load()

    chrome.windows.getCurrent().then((w) => {
      if (w.id !== undefined) setCurrentWindowId(w.id)
    })

    const onChange = () => load()
    chrome.tabs.onCreated.addListener(onChange)
    chrome.tabs.onRemoved.addListener(onChange)
    chrome.tabs.onUpdated.addListener(onChange)
    return () => {
      chrome.tabs.onCreated.removeListener(onChange)
      chrome.tabs.onRemoved.removeListener(onChange)
      chrome.tabs.onUpdated.removeListener(onChange)
    }
  }, [])

  const filtered = useMemo(
    () => filterTabs(tabs, filters, currentWindowId),
    [tabs, filters, currentWindowId],
  )

  const groups = useMemo(
    () => groupTabs(filtered, mode, currentWindowId),
    [filtered, mode, currentWindowId],
  )

  const activate = async (tab: TabInfo) => {
    await chrome.tabs.update(tab.id, { active: true })
    await chrome.windows.update(tab.windowId, { focused: true })
  }

  const close = async (tab: TabInfo) => {
    await chrome.tabs.remove(tab.id)
  }

  const toggleCollapsed = (key: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const togglePill = (key: keyof Omit<Filters, 'query'>) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const isFiltered = filtered.length !== tabs.length
  const anyPillActive = FILTER_PILLS.some((p) => filters[p.key])
  const canReset = anyPillActive || filters.query.length > 0

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <input
          type="search"
          autoFocus
          value={filters.query}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, query: e.target.value }))
          }
          placeholder="Search tabs by title or URL…"
          className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm placeholder:text-neutral-500 focus:border-neutral-600 focus:outline-none"
        />
        <div className="flex flex-wrap items-center gap-2">
          {FILTER_PILLS.map((pill) => {
            const active = filters[pill.key]
            return (
              <button
                key={pill.key}
                onClick={() => togglePill(pill.key)}
                className={
                  'rounded-full border px-3 py-1 text-xs transition-colors ' +
                  (active
                    ? 'border-blue-500 bg-blue-500/15 text-blue-200'
                    : 'border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200')
                }
              >
                {pill.label}
              </button>
            )
          })}
          {canReset && (
            <button
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="ml-auto text-xs text-neutral-500 hover:text-neutral-200"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-400">
          {isFiltered
            ? `${filtered.length} of ${tabs.length} tabs`
            : `${tabs.length} tabs open`}
        </span>
        <div className="inline-flex overflow-hidden rounded-md border border-neutral-800">
          {GROUP_MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={
                'px-3 py-1 text-xs transition-colors ' +
                (mode === m.value
                  ? 'bg-neutral-700 text-white'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white')
              }
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {groups.length === 0 || filtered.length === 0 ? (
        <p className="py-3 text-sm text-neutral-500">
          {tabs.length === 0 ? 'No tabs found.' : 'No tabs match the current filter.'}
        </p>
      ) : (
        groups.map((group) => {
          const isCollapsed = collapsed.has(group.key)
          const showHeader = mode !== 'none'
          return (
            <section key={group.key}>
              {showHeader && (
                <button
                  onClick={() => toggleCollapsed(group.key)}
                  className="mb-1 flex w-full items-center gap-2 text-left text-xs uppercase tracking-wide text-neutral-400 hover:text-white"
                >
                  <span className="inline-block w-3">{isCollapsed ? '▸' : '▾'}</span>
                  <span>{group.label}</span>
                  <span className="text-neutral-600">· {group.tabs.length}</span>
                </button>
              )}
              {!isCollapsed && (
                <ul className="divide-y divide-neutral-800">
                  {group.tabs.map((tab) => (
                    <TabRow
                      key={tab.id}
                      tab={tab}
                      onActivate={activate}
                      onClose={close}
                    />
                  ))}
                </ul>
              )}
            </section>
          )
        })
      )}
    </div>
  )
}
