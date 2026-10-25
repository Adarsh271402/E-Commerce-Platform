'use client'

import Image from 'next/image'
import { Star, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { ShopProduct } from '@/lib/shop-types'
import { formatPrice } from '@/lib/shop-types'
import { useCart } from '@/store/cart'
import { useUI } from '@/store/ui'
import { toast } from 'sonner'

export function ProductCard({ product }: { product: ShopProduct }) {
  const add = useCart((s) => s.add)
  const navigate = useUI((s) => s.navigate)

  const addToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (product.stock <= 0) return
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock,
    })
    toast.success(`${product.name} added to your bag.`)
  }

  const soldOut = product.stock <= 0

  return (
    <article
      className="group cursor-pointer"
      onClick={() => navigate('product', product.id)}
      tabIndex={0}
      role="button"
      aria-label={`View ${product.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          navigate('product', product.id)
        }
      }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg border bg-secondary">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute left-2.5 top-2.5 flex gap-1.5">
          {product.isNew && (
            <Badge className="bg-brand text-brand-foreground border-0 hover:bg-brand">New</Badge>
          )}
          {product.featured && (
            <Badge variant="secondary" className="border-0 bg-white/85 text-foreground backdrop-blur">
              Featured
            </Badge>
          )}
        </div>
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <span className="rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-background">
              Sold out
            </span>
          </div>
        )}
        {!soldOut && (
          <Button
            size="sm"
            onClick={addToCart}
            className="absolute bottom-2.5 left-2.5 right-2.5 translate-y-1 bg-white/95 text-foreground opacity-0 shadow-md transition-all duration-300 hover:bg-white group-hover:translate-y-0 group-hover:opacity-100 max-lg:translate-y-0 max-lg:opacity-100"
          >
            <ShoppingBag className="mr-1.5 h-4 w-4" /> Add to Bag
          </Button>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          {product.category.name}
        </p>
        <h3 className="font-display text-[17px] font-medium leading-snug">{product.name}</h3>
        <div className="flex items-center justify-between pr-1">
          <p className="text-[15px] font-semibold">{formatPrice(product.price)}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            {product.rating.toFixed(1)}
            <span>({product.reviewCount})</span>
          </div>
        </div>
      </div>
    </article>
  )
}
