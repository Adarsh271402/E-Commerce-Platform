'use client'

import Image from 'next/image'
import { ArrowLeft, ArrowRight, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/shop-types'
import { useCart, cartSubtotal } from '@/store/cart'
import { useUI } from '@/store/ui'

const FREE_SHIPPING_THRESHOLD = 150
const SHIPPING_FLAT = 12

export function CartPageView() {
  const lines = useCart((s) => s.lines)
  const setQuantity = useCart((s) => s.setQuantity)
  const remove = useCart((s) => s.remove)
  const navigate = useUI((s) => s.navigate)

  const subtotal = cartSubtotal(lines)
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT
  const total = subtotal + shipping

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-28 text-center">
        <div className="rounded-full bg-secondary p-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-medium">Your bag is empty</h1>
        <p className="mt-3 max-w-sm text-muted-foreground">
          Once you add something beautiful, it will show up here. Start with our featured picks of
          the week.
        </p>
        <Button
          size="lg"
          className="mt-8 bg-brand text-brand-foreground hover:bg-brand/90"
          onClick={() => navigate('catalog')}
        >
          Explore the Collection <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <button
        onClick={() => navigate('catalog')}
        className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" /> Continue shopping
      </button>

      <h1 className="font-display text-3xl font-medium sm:text-4xl">Shopping Bag</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {lines.length} style{lines.length > 1 ? 's' : ''} ·{' '}
        {lines.reduce((n, l) => n + l.quantity, 0)} item
        {lines.reduce((n, l) => n + l.quantity, 0) > 1 ? 's' : ''}
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* lines */}
        <div>
          <ul className="divide-y border-y">
            {lines.map((line) => (
              <li key={line.productId} className="flex gap-4 py-6 sm:gap-6">
                <button
                  className="relative h-32 w-26 shrink-0 overflow-hidden rounded-lg border bg-secondary sm:h-40 sm:w-32"
                  onClick={() => navigate('product', line.productId)}
                  aria-label={`View ${line.name}`}
                >
                  <Image
                    src={line.imageUrl}
                    alt={line.name}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </button>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <button
                        className="text-left font-display text-lg font-medium leading-snug hover:underline"
                        onClick={() => navigate('product', line.productId)}
                      >
                        {line.name}
                      </button>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatPrice(line.price)} each
                      </p>
                    </div>
                    <p className="text-base font-semibold">
                      {formatPrice(line.price * line.quantity)}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center rounded-md border">
                      <button
                        className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
                        onClick={() => setQuantity(line.productId, line.quantity - 1)}
                        disabled={line.quantity <= 1}
                        aria-label={`Decrease quantity of ${line.name}`}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-9 text-center text-sm font-medium">{line.quantity}</span>
                      <button
                        className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
                        onClick={() => setQuantity(line.productId, line.quantity + 1)}
                        disabled={line.quantity >= line.stock}
                        aria-label={`Increase quantity of ${line.name}`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-destructive"
                      onClick={() => remove(line.productId)}
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* summary */}
        <aside className="h-fit rounded-lg border bg-card p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-xl font-medium">Order Summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">
                {shipping === 0 ? (
                  <span className="text-emerald-700">Free</span>
                ) : (
                  formatPrice(shipping)
                )}
              </span>
            </div>
            {shipping > 0 && (
              <p className="rounded-md bg-secondary px-3 py-2 text-xs text-secondary-foreground">
                Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more to unlock free shipping.
              </p>
            )}
            <Separator />
            <div className="flex justify-between text-base">
              <span className="font-medium">Total</span>
              <span className="font-semibold">{formatPrice(total)}</span>
            </div>
          </div>
          <Button
            size="lg"
            className="mt-6 w-full bg-brand text-brand-foreground hover:bg-brand/90"
            onClick={() => navigate('checkout')}
          >
            Proceed to Checkout <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Secure checkout · Free 30-day returns
          </p>
        </aside>
      </div>
    </div>
  )
}
