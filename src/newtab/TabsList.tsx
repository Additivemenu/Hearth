import { useEffect, useState } from 'react'

type TabInfo = {
  id: number
  title: string
  url: string
  favIconUrl?: string
  windowId: number
}

export function TabsList() {
  const [tabs, setTabs] = useState<TabInfo[]>([])

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

  const activate = async (tab: TabInfo) => {
    await chrome.tabs.update(tab.id, { active: true })
    await chrome.windows.update(tab.windowId, { focused: true })
  }

  const close = async (tab: TabInfo) => {
    await chrome.tabs.remove(tab.id)
  }

  return (
    <ul className="divide-y divide-neutral-800">
      {tabs.length === 0 && (
        <li className="py-3 text-sm text-neutral-500">No tabs found.</li>
      )}
      {tabs.map((tab) => (
        <li key={tab.id} className="flex items-center gap-3 py-2">
          {tab.favIconUrl ? (
            <img src={tab.favIconUrl} alt="" className="h-4 w-4 shrink-0" />
          ) : (
            <span className="h-4 w-4 shrink-0 rounded bg-neutral-700" />
          )}
          <button
            onClick={() => activate(tab)}
            className="min-w-0 flex-1 truncate text-left text-sm hover:text-white"
            title={tab.url}
          >
            {tab.title}
          </button>
          <button
            onClick={() => close(tab)}
            className="rounded px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            Close
          </button>
        </li>
      ))}
    </ul>
  )
}
