'use client'

import { useQuery } from '@tanstack/react-query'
import type { ShopProduct, ShopOrder } from '@/lib/shop-types'
import { useAuth } from '@/store/auth'

export function useProducts() {
  return useQuery<ShopProduct[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/api/products', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load products')
      const data = await res.json()
      return data.products as ShopProduct[]
    },
    staleTime: 60_000,
  })
}

export function useProduct(id: string | null) {
  return useQuery<ShopProduct>({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load product')
      const data = await res.json()
      return data.product as ShopProduct
    },
    enabled: !!id,
  })
}

export function useOrders() {
  const user = useAuth((s) => s.user)
  return useQuery<ShopOrder[]>({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      const res = await fetch('/api/orders', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load orders')
      const data = await res.json()
      return data.orders as ShopOrder[]
    },
    enabled: !!user,
  })
}
