'use client'

import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCart, cartSubtotal } from '@/store/cart'
import { useUI } from '@/store/ui'
import { formatPrice } from '@/lib/shop-types'

const FREE_SHIPPING_THRESHOLD = 150

export function CartDrawer() {
  const cartOpen = useUI((s) => s.cartOpen)
  const closeCart = useUI((s) => s.closeCart)
  const navigate = useUI((s) => s.navigate)
  const lines = useCart((s) => s.lines)
  const setQuantity = useCart((s) => s.setQuantity)
  const remove = useCart((s) => s.remove)

  const subtotal = cartSubtotal(lines)
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal

  return (
    <Sheet open={cartOpen} onOpenChange={(open) => (open ? undefined : closeCart())}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-xl">Your Bag</SheetTitle>
          <SheetDescription>
            {lines.length === 0
              ? 'Beautiful things await.'
              : `${lines.length} style${lines.length > 1 ? 's' : ''} in your bag`}
          </SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="rounded-full bg-secondary p-5">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-display text-lg font-medium">Your bag is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Explore the collection and find your everyday essential.
              </p>
            </div>
            <Button
              onClick={() => navigate('catalog')}
              className="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {remaining > 0 && (
              <div className="mx-4 rounded-md bg-secondary px-3 py-2 text-center text-xs text-secondary-foreground">
                You are <span className="font-semibold">{formatPrice(remaining)}</span> away from
                free shipping
              </div>
            )}

            <div className="thin-scrollbar flex-1 overflow-y-auto px-4">
              <ul className="divide-y">
                {lines.map((line) => (
                  <li key={line.productId} className="flex gap-3 py-4">
                    <button
                      className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md border bg-secondary"
                      onClick={() => navigate('product', line.productId)}
                      aria-label={`View ${line.name}`}
                    >
                      <Image
                        src={line.imageUrl}
                        alt={line.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <button
                          className="truncate text-left text-sm font-medium hover:underline"
                          onClick={() => navigate('product', line.productId)}
                        >
                          {line.name}
                        </button>
                        <p className="text-sm font-semibold">{formatPrice(line.price * line.quantity)}</p>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatPrice(line.price)} each
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-md border">
                          <button
                            className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
                            onClick={() => setQuantity(line.productId, line.quantity - 1)}
                            aria-label={`Decrease quantity of ${line.name}`}
                            disabled={line.quantity <= 1}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{line.quantity}</span>
                          <button
                            className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
                            onClick={() => setQuantity(line.productId, line.quantity + 1)}
                            aria-label={`Increase quantity of ${line.name}`}
                            disabled={line.quantity >= line.stock}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
                          onClick={() => remove(line.productId)}
                          aria-label={`Remove ${line.name} from bag`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t px-4 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-base font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Shipping calculated at checkout. Free over $150.
              </p>
              <Separator className="my-3" />
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => navigate('cart')}>
                  View Bag
                </Button>
                <Button
                  onClick={() => navigate('checkout')}
                  className="bg-brand text-brand-foreground hover:bg-brand/90"
                >
                  Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
