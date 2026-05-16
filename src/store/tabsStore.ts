import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
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
  // childTabId -> parentTabId. Captured at creation time so the relationship
  // survives the parent closing (Chrome clears `openerTabId` in that case).
  // Session-scoped: tab IDs don't survive a browser restart, so neither does this.
  openerMap: Map<number, number>

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
  tree: [],
}

export const useTabsStore = create<TabsState>()(
  subscribeWithSelector((set, get) => ({
    tabs: [],
    currentWindowId: null,
    mode: 'window',
    filters: EMPTY_FILTERS,
    collapsed: new Set(),
    groupOrder: EMPTY_GROUP_ORDER,
    openerMap: new Map(),

    loadTabs: async () => {
      const [all, currentWindow] = await Promise.all([
        chrome.tabs.query({}),
        chrome.windows.getCurrent(),
      ])
      const tabs: TabInfo[] = all
        .filter(
          (t): t is chrome.tabs.Tab & { id: number } => t.id !== undefined,
        )
        .map((t) => ({
          id: t.id,
          title: t.title ?? t.url ?? '(untitled)',
          url: t.url ?? '',
          favIconUrl: t.favIconUrl,
          windowId: t.windowId,
          audible: t.audible ?? false,
          pinned: t.pinned,
          active: t.active,
          openerTabId: t.openerTabId,
        }))

      set((s) => {
        // Seed openerMap from Chrome's current openerTabId for tabs we
        // haven't already captured. This way, tabs that existed before the
        // extension was active still get a parent recorded (as long as Chrome
        // still knows it).
        const nextOpener = new Map(s.openerMap)
        for (const tab of tabs) {
          if (tab.openerTabId !== undefined && !nextOpener.has(tab.id)) {
            nextOpener.set(tab.id, tab.openerTabId)
          }
        }
        return {
          tabs,
          currentWindowId: currentWindow.id ?? null,
          openerMap: nextOpener,
        }
      })
    },

    subscribeToChromeEvents: () => {
      const reload = () => {
        void get().loadTabs()
      }
      const onCreated = (tab: chrome.tabs.Tab) => {
        if (tab.id !== undefined && tab.openerTabId !== undefined) {
          const childId = tab.id
          const parentId = tab.openerTabId
          set((s) => {
            const next = new Map(s.openerMap)
            next.set(childId, parentId)
            return { openerMap: next }
          })
        }
        reload()
      }
      const onRemoved = (tabId: number) => {
        set((s) => {
          if (!s.openerMap.has(tabId)) return s
          const next = new Map(s.openerMap)
          next.delete(tabId)
          return { openerMap: next }
        })
        reload()
      }
      chrome.tabs.onCreated.addListener(onCreated)
      chrome.tabs.onRemoved.addListener(onRemoved)
      chrome.tabs.onUpdated.addListener(reload)
      return () => {
        chrome.tabs.onCreated.removeListener(onCreated)
        chrome.tabs.onRemoved.removeListener(onRemoved)
        chrome.tabs.onUpdated.removeListener(reload)
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
  })),
)
