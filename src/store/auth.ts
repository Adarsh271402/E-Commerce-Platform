'use client'

import { create } from 'zustand'
import type { ShopUser } from '@/lib/shop-types'

type AuthState = {
  user: ShopUser | null
  loading: boolean
  setUser: (user: ShopUser | null) => void
  fetchMe: () => Promise<void>
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
}

export const useAuth = create<AuthState>()((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  fetchMe: async () => {
    try {
      set({ loading: true })
      const res = await fetch('/api/auth/me', { cache: 'no-store' })
      const data = await res.json()
      set({ user: data.user ?? null, loading: false })
    } catch {
      set({ user: null, loading: false })
    }
  },
  login: async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) return { ok: false, error: data.error || 'Sign in failed.' }
      set({ user: data.user })
      return { ok: true }
    } catch {
      return { ok: false, error: 'Network error. Please try again.' }
    }
  },
  register: async (name, email, password) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) return { ok: false, error: data.error || 'Registration failed.' }
      set({ user: data.user })
      return { ok: true }
    } catch {
      return { ok: false, error: 'Network error. Please try again.' }
    }
  },
  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      set({ user: null })
    }
  },
}))
