import { create } from 'zustand'
import {
  EMPTY_FILTERS,
  type Filters,
  type GroupMode,
  type TabInfo,
} from '../newtab/tabs'

type TabsState = {
  tabs: TabInfo[]
  currentWindowId: number | null
  mode: GroupMode
  filters: Filters
  collapsed: Set<string>
  groupOrder: Record<GroupMode, string[]>

  loadTabs: () => Promise<void>
  subscribeToChromeEvents: () => () => void

  setMode: (mode: GroupMode) => void
  setQuery: (query: string) => void
  togglePill: (key: keyof Omit<Filters, 'query'>) => void
  resetFilters: () => void
  toggleCollapsed: (key: string) => void
  setGroupOrder: (mode: GroupMode, keys: string[]) => void

  activate: (tab: TabInfo) => Promise<void>
  close: (tab: TabInfo) => Promise<void>
}

const EMPTY_GROUP_ORDER: Record<GroupMode, string[]> = {
  none: [],
  window: [],
  domain: [],
}

export const useTabsStore = create<TabsState>((set, get) => ({
  tabs: [],
  currentWindowId: null,
  mode: 'window',
  filters: EMPTY_FILTERS,
  collapsed: new Set(),
  groupOrder: EMPTY_GROUP_ORDER,

  loadTabs: async () => {
    const [all, currentWindow] = await Promise.all([
      chrome.tabs.query({}),
      chrome.windows.getCurrent(),
    ])
    const tabs: TabInfo[] = all
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
      }))
    set({ tabs, currentWindowId: currentWindow.id ?? null })
  },

  subscribeToChromeEvents: () => {
    const onChange = () => {
      void get().loadTabs()
    }
    chrome.tabs.onCreated.addListener(onChange)
    chrome.tabs.onRemoved.addListener(onChange)
    chrome.tabs.onUpdated.addListener(onChange)
    return () => {
      chrome.tabs.onCreated.removeListener(onChange)
      chrome.tabs.onRemoved.removeListener(onChange)
      chrome.tabs.onUpdated.removeListener(onChange)
    }
  },

  setMode: (mode) => set({ mode }),
  setQuery: (query) => set((s) => ({ filters: { ...s.filters, query } })),
  togglePill: (key) =>
    set((s) => ({ filters: { ...s.filters, [key]: !s.filters[key] } })),
  resetFilters: () => set({ filters: EMPTY_FILTERS }),
  toggleCollapsed: (key) =>
    set((s) => {
      const next = new Set(s.collapsed)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return { collapsed: next }
    }),
  setGroupOrder: (mode, keys) =>
    set((s) => ({ groupOrder: { ...s.groupOrder, [mode]: keys } })),

  activate: async (tab) => {
    await chrome.tabs.update(tab.id, { active: true })
    await chrome.windows.update(tab.windowId, { focused: true })
  },
  close: async (tab) => {
    await chrome.tabs.remove(tab.id)
  },
}))
