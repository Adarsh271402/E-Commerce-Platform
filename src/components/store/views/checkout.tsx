'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ArrowLeft, CheckCircle2, Lock, ShoppingBag, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/shop-types'
import { useCart, cartSubtotal } from '@/store/cart'
import { useAuth } from '@/store/auth'
import { useUI } from '@/store/ui'
import type { ShopOrder } from '@/lib/shop-types'

const FREE_SHIPPING_THRESHOLD = 150
const SHIPPING_FLAT = 12

export function CheckoutView() {
  const user = useAuth((s) => s.user)
  const loadingUser = useAuth((s) => s.loading)
  const lines = useCart((s) => s.lines)
  const clear = useCart((s) => s.clear)
  const navigate = useUI((s) => s.navigate)
  const setPendingView = useUI((s) => s.setPendingView)

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [placedOrder, setPlacedOrder] = useState<ShopOrder | null>(null)

  const subtotal = cartSubtotal(lines)
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT
  const total = subtotal + shipping

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const displayName = form.fullName || user?.name || ''
  const displayEmail = form.email || user?.email || ''

  const placeOrder = async () => {
    setServerError(null)
    if (!displayName.trim() || !displayEmail.trim() || !form.address.trim() || !form.city.trim()) {
      setServerError('Please fill in your name, email, address and city.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
          fullName: displayName,
          email: displayEmail,
          phone: form.phone,
          address: form.address,
          city: form.city,
          zip: form.zip,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setServerError(data.error || 'Failed to place order.')
        return
      }
      setPlacedOrder(data.order as ShopOrder)
      clear()
    } catch {
      setServerError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ---------- order placed: success panel ----------
  if (placedOrder) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-9 w-9 text-emerald-600" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-medium sm:text-4xl">Thank you!</h1>
        <p className="mt-3 text-muted-foreground">
          Your order <span className="font-semibold text-foreground">{placedOrder.orderNo}</span>{' '}
          has been placed. A confirmation email is on its way to{' '}
          <span className="font-medium text-foreground">{placedOrder.email}</span>.
        </p>
        <div className="mx-auto mt-8 max-w-md rounded-lg border bg-card p-5 text-left">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
              Processing
            </span>
          </div>
          <Separator className="my-3" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {placedOrder.items.length} item{placedOrder.items.length > 1 ? 's' : ''}
            </span>
            <span className="font-semibold">{formatPrice(placedOrder.total)}</span>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            size="lg"
            className="bg-brand text-brand-foreground hover:bg-brand/90"
            onClick={() => navigate('orders')}
          >
            View My Orders
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('catalog')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  // ---------- guard: empty cart ----------
  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-28 text-center">
        <div className="rounded-full bg-secondary p-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-medium">Nothing to check out</h1>
        <p className="mt-3 text-muted-foreground">Your bag is empty — add a bag or two first.</p>
        <Button
          size="lg"
          className="mt-8 bg-brand text-brand-foreground hover:bg-brand/90"
          onClick={() => navigate('catalog')}
        >
          Explore the Collection
        </Button>
      </div>
    )
  }

  // ---------- guard: not signed in ----------
  if (loadingUser) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center text-muted-foreground">
        Loading checkout…
      </div>
    )
  }
  if (!user) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
        <div className="rounded-full bg-secondary p-6">
          <User className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-medium">Sign in to check out</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Create an account or sign in so we can attach this order to you and let you track it any
          time. Your bag will be waiting.
        </p>
        <Button
          size="lg"
          className="mt-8 bg-brand text-brand-foreground hover:bg-brand/90"
          onClick={() => {
            setPendingView('checkout')
            navigate('auth')
          }}
        >
          Sign in / Create Account
        </Button>
      </div>
    )
  }

  // ---------- checkout form ----------
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <button
        onClick={() => navigate('cart')}
        className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to bag
      </button>

      <h1 className="font-display text-3xl font-medium sm:text-4xl">Checkout</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* form */}
        <div className="space-y-8">
          <section className="rounded-lg border bg-card p-6">
            <h2 className="font-display text-xl font-medium">Contact</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full name *</Label>
                <Input
                  id="fullName"
                  value={displayName}
                  onChange={set('fullName')}
                  placeholder={user.name}
                  autoComplete="name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={displayEmail}
                  onChange={set('email')}
                  placeholder={user.email}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="+1 (555) 000-0000"
                  autoComplete="tel"
                />
              </div>
            </div>
          </section>

          <section className="rounded-lg border bg-card p-6">
            <h2 className="font-display text-xl font-medium">Shipping address</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="address">Street address *</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={set('address')}
                  placeholder="123 Madison Avenue, Apt 5B"
                  autoComplete="street-address"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={set('city')}
                  placeholder="New York"
                  autoComplete="address-level2"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="zip">ZIP / Postal code</Label>
                <Input
                  id="zip"
                  value={form.zip}
                  onChange={set('zip')}
                  placeholder="10016"
                  autoComplete="postal-code"
                />
              </div>
            </div>
          </section>

          <section className="rounded-lg border bg-card p-6">
            <h2 className="font-display text-xl font-medium">Payment</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This is a demo storefront — no real payment is processed. Your card would normally be
              charged here.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-md border border-dashed bg-secondary/60 px-4 py-3 text-sm text-muted-foreground">
              <Lock className="h-4 w-4 text-brand" />
              Payments are simulated for demonstration purposes.
            </div>
          </section>
        </div>

        {/* summary */}
        <aside className="h-fit rounded-lg border bg-card p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-xl font-medium">
            {lines.length} item{lines.length > 1 ? 's' : ''} in your bag
          </h2>
          <ul className="thin-scrollbar mt-4 max-h-72 space-y-4 overflow-y-auto pr-1">
            {lines.map((line) => (
              <li key={line.productId} className="flex items-center gap-3">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md border bg-secondary">
                  <Image src={line.imageUrl} alt={line.name} fill sizes="56px" className="object-cover" />
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold text-background">
                    {line.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{line.name}</p>
                  <p className="text-xs text-muted-foreground">{formatPrice(line.price)} each</p>
                </div>
                <p className="text-sm font-semibold">{formatPrice(line.price * line.quantity)}</p>
              </li>
            ))}
          </ul>

          <Separator className="my-4" />

          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">
                {shipping === 0 ? <span className="text-emerald-700">Free</span> : formatPrice(shipping)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-base">
              <span className="font-medium">Total</span>
              <span className="font-semibold">{formatPrice(total)}</span>
            </div>
          </div>

          {serverError && (
            <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {serverError}
            </p>
          )}

          <Button
            size="lg"
            className="mt-5 w-full bg-brand text-brand-foreground hover:bg-brand/90"
            onClick={placeOrder}
            disabled={submitting}
          >
            {submitting ? 'Placing order…' : `Place Order · ${formatPrice(total)}`}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            By placing this order you agree to our demo terms.
          </p>
        </aside>
      </div>
    </div>
  )
}
