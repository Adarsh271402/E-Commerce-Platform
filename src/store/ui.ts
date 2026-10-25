'use client'

import { create } from 'zustand'

export type ShopView = 'catalog' | 'product' | 'cart' | 'checkout' | 'orders' | 'auth'

type UIState = {
  view: ShopView
  productId: string | null
  cartOpen: boolean
  menuOpen: boolean
  query: string
  category: string
  pendingView: ShopView | null
  navigate: (view: ShopView, productId?: string | null) => void
  openCart: () => void
  closeCart: () => void
  setMenuOpen: (open: boolean) => void
  setQuery: (q: string) => void
  setCategory: (slug: string) => void
  setPendingView: (view: ShopView | null) => void
}

export const useUI = create<UIState>()((set) => ({
  view: 'catalog',
  productId: null,
  cartOpen: false,
  menuOpen: false,
  query: '',
  category: 'all',
  pendingView: null,
  navigate: (view, productId = null) =>
    set({ view, productId, cartOpen: false, menuOpen: false }),
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  setMenuOpen: (open) => set({ menuOpen: open }),
  setQuery: (q) => set({ query: q }),
  setCategory: (slug) => set({ category: slug }),
  setPendingView: (view) => set({ pendingView: view }),
}))
