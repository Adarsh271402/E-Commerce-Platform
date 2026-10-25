'use client'

import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Header } from '@/components/store/header'
import { Footer } from '@/components/store/footer'
import { CartDrawer } from '@/components/store/cart-drawer'
import { CatalogView } from '@/components/store/views/catalog'
import { ProductDetailView } from '@/components/store/views/product-detail'
import { CartPageView } from '@/components/store/views/cart-page'
import { CheckoutView } from '@/components/store/views/checkout'
import { OrdersView } from '@/components/store/views/orders'
import { AuthView } from '@/components/store/views/auth-view'
import { useUI } from '@/store/ui'
import { useAuth } from '@/store/auth'

function ShopShell() {
  const view = useUI((s) => s.view)
  const productId = useUI((s) => s.productId)
  const fetchMe = useAuth((s) => s.fetchMe)

  // fetch current session user once on mount
  useEffect(() => {
    fetchMe()
  }, [fetchMe])

  // scroll to top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [view, productId])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {view === 'catalog' && <CatalogView />}
        {view === 'product' && <ProductDetailView />}
        {view === 'cart' && <CartPageView />}
        {view === 'checkout' && <CheckoutView />}
        {view === 'orders' && <OrdersView />}
        {view === 'auth' && <AuthView />}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}

export function StoreApp() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ShopShell />
    </QueryClientProvider>
  )
}
