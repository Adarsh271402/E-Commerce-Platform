'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ChevronDown, Package, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useOrders } from '@/hooks/use-shop'
import { formatPrice, ORDER_STATUS_LABELS } from '@/lib/shop-types'
import { useAuth } from '@/store/auth'
import { useUI } from '@/store/ui'
import type { ShopOrder } from '@/lib/shop-types'

function statusBadgeClass(status: string): string {
  switch (status) {
    case 'PROCESSING':
      return 'bg-amber-100 text-amber-800 border-0 hover:bg-amber-100'
    case 'SHIPPED':
      return 'bg-sky-100 text-sky-800 border-0 hover:bg-sky-100'
    case 'DELIVERED':
      return 'bg-emerald-100 text-emerald-800 border-0 hover:bg-emerald-100'
    case 'CANCELLED':
      return 'bg-rose-100 text-rose-800 border-0 hover:bg-rose-100'
    default:
      return 'bg-secondary text-secondary-foreground border-0'
  }
}

function OrderCard({ order }: { order: ShopOrder }) {
  const [open, setOpen] = useState(false)
  const date = new Date(order.createdAt)
  const dateStr = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <article className="overflow-hidden rounded-lg border bg-card">
      <button
        className="flex w-full flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 text-left hover:bg-secondary/50"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className="min-w-36">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Order</p>
          <p className="mt-0.5 text-sm font-semibold">{order.orderNo}</p>
        </div>
        <div className="min-w-28">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Placed</p>
          <p className="mt-0.5 text-sm">{dateStr}</p>
        </div>
        <div className="min-w-24">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Total</p>
          <p className="mt-0.5 text-sm font-semibold">{formatPrice(order.total)}</p>
        </div>
        <div className="flex items-center gap-2 sm:ml-auto">
          <Badge className={statusBadgeClass(order.status)}>
            {ORDER_STATUS_LABELS[order.status] ?? order.status}
          </Badge>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {open && (
        <div className="border-t bg-secondary/30 px-5 py-4">
          <ul className="space-y-4">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md border bg-secondary">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Qty {item.quantity} · {formatPrice(item.price)} each
                  </p>
                </div>
                <p className="text-sm font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
          <Separator className="my-4" />
          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Shipping to
              </p>
              <p className="mt-1.5 leading-relaxed">
                {order.fullName}
                <br />
                {order.address}
                <br />
                {order.city}
                {order.zip ? `, ${order.zip}` : ''}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Contact
              </p>
              <p className="mt-1.5 leading-relaxed">
                {order.email}
                {order.phone ? (
                  <>
                    <br />
                    {order.phone}
                  </>
                ) : null}
              </p>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

export function OrdersView() {
  const user = useAuth((s) => s.user)
  const loadingUser = useAuth((s) => s.loading)
  const navigate = useUI((s) => s.navigate)
  const { data: orders, isLoading } = useOrders()

  if (loadingUser) {
    return <div className="py-24 text-center text-muted-foreground">Loading…</div>
  }

  if (!user) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
        <div className="rounded-full bg-secondary p-6">
          <Package className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-medium">Sign in to see your orders</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Your order history lives in your account — sign in to review past orders and follow their
          progress.
        </p>
        <Button
          size="lg"
          className="mt-8 bg-brand text-brand-foreground hover:bg-brand/90"
          onClick={() => navigate('auth')}
        >
          Sign in
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-medium sm:text-4xl">My Orders</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Signed in as {user.name} · {user.email}
      </p>

      {isLoading ? (
        <div className="mt-8 space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed py-20 text-center">
          <Package className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-4 font-display text-xl font-medium">No orders yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            When you place your first order it will appear here.
          </p>
          <Button
            className="mt-6 bg-brand text-brand-foreground hover:bg-brand/90"
            onClick={() => navigate('catalog')}
          >
            Start Shopping <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
