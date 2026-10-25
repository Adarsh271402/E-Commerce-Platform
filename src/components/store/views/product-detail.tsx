'use client'

import Image from 'next/image'
import { useState } from 'react'
import {
  ArrowLeft,
  Star,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useProduct, useProducts } from '@/hooks/use-shop'
import { formatPrice } from '@/lib/shop-types'
import { useCart } from '@/store/cart'
import { useUI } from '@/store/ui'
import { ProductCard } from '@/components/store/product-card'
import { toast } from 'sonner'

export function ProductDetailView() {
  const productId = useUI((s) => s.productId)
  const navigate = useUI((s) => s.navigate)
  const add = useCart((s) => s.add)
  const { data: product, isLoading } = useProduct(productId)
  const { data: allProducts } = useProducts()

  const [qty, setQty] = useState(1)

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2">
        <Skeleton className="aspect-[4/5] w-full rounded-lg" />
        <div className="space-y-4 py-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-64" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-medium">Product not found</h1>
        <p className="mt-3 text-muted-foreground">
          This piece may have sold out or been moved.
        </p>
        <Button
          className="mt-6 bg-brand text-brand-foreground hover:bg-brand/90"
          onClick={() => navigate('catalog')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to the collection
        </Button>
      </div>
    )
  }

  const soldOut = product.stock <= 0
  const lowStock = !soldOut && product.stock <= 10
  const detailPoints = product.details.split('·').map((s) => s.trim()).filter(Boolean)
  const related = (allProducts ?? [])
    .filter((p) => p.id !== product.id && p.category.slug === product.category.slug)
    .slice(0, 4)

  const addToBag = () => {
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
      },
      qty
    )
    toast.success(`${product.name} × ${qty} added to your bag.`)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <button
        onClick={() => navigate('catalog')}
        className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to shop
      </button>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* image */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border bg-secondary">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {product.isNew && (
              <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-foreground">
                New
              </span>
            )}
          </div>
        </div>

        {/* info */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">
            {product.category.name}
          </p>
          <h1 className="mt-2.5 font-display text-3xl font-medium leading-tight sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex" aria-label={`Rated ${product.rating} out of 5`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(product.rating)
                      ? 'fill-amber-500 text-amber-500'
                      : 'fill-stone-200 text-stone-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating.toFixed(1)} · {product.reviewCount} reviews
            </span>
          </div>

          <p className="mt-4 text-2xl font-semibold">{formatPrice(product.price)}</p>

          <p className="mt-5 leading-relaxed text-muted-foreground">{product.description}</p>

          <Separator className="my-6" />

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-md border">
              <button
                className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1 || soldOut}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-medium" aria-live="polite">
                {qty}
              </span>
              <button
                className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                disabled={qty >= product.stock || soldOut}
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              size="lg"
              className="h-11 flex-1 bg-primary px-8 text-primary-foreground hover:bg-primary/90 sm:flex-none"
              onClick={addToBag}
              disabled={soldOut}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              {soldOut ? 'Sold out' : 'Add to Bag'}
            </Button>
          </div>

          <p className="mt-3 text-sm">
            {soldOut ? (
              <span className="text-destructive">Currently out of stock</span>
            ) : lowStock ? (
              <span className="font-medium text-brand">
                Only {product.stock} left — order soon
              </span>
            ) : (
              <span className="text-emerald-700">In stock and ready to ship</span>
            )}
          </p>

          <Separator className="my-6" />

          <h2 className="text-sm font-semibold uppercase tracking-[0.18em]">Details</h2>
          <ul className="mt-3 space-y-2">
            {detailPoints.map((point) => (
              <li key={point} className="flex items-start text-sm text-muted-foreground">
                <span className="mr-2.5 mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand" />
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-7 grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-3">
            {[
              { icon: Truck, label: 'Free shipping over $150' },
              { icon: RotateCcw, label: '30-day free returns' },
              { icon: ShieldCheck, label: '2-year craftsmanship warranty' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <item.icon className="h-4 w-4 shrink-0 text-brand" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="mt-20 border-t pt-12">
          <h2 className="font-display text-2xl font-medium">You may also like</h2>
          <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-9 lg:grid-cols-4 lg:gap-x-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
