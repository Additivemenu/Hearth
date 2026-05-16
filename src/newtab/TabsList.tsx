import { useEffect, useMemo, useState } from 'react'
import { TabRow } from './TabRow'
import { groupTabs, type GroupMode, type TabInfo } from './tabs'

const GROUP_MODES: { value: GroupMode; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'window', label: 'Window' },
  { value: 'domain', label: 'Domain' },
]

export function TabsList() {
  const [tabs, setTabs] = useState<TabInfo[]>([])
  const [currentWindowId, setCurrentWindowId] = useState<number | null>(null)
  const [mode, setMode] = useState<GroupMode>('window')
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

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

  const groups = useMemo(
    () => groupTabs(tabs, mode, currentWindowId),
    [tabs, mode, currentWindowId],
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-400">{tabs.length} tabs open</span>
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

      {groups.length === 0 && (
        <p className="py-3 text-sm text-neutral-500">No tabs found.</p>
      )}

      {groups.map((group) => {
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
      })}
    </div>
  )
}
