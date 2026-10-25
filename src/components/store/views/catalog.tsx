'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Truck, RotateCcw, ShieldCheck, Leaf, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductCard } from '@/components/store/product-card'
import { useProducts } from '@/hooks/use-shop'
import { useUI } from '@/store/ui'
import type { ShopProduct } from '@/lib/shop-types'

const VALUE_PROPS = [
  { icon: Truck, title: 'Free Shipping', text: 'On all orders over $150' },
  { icon: RotateCcw, title: '30-Day Returns', text: 'Easy, no-questions returns' },
  { icon: ShieldCheck, title: 'Secure Checkout', text: '256-bit SSL encryption' },
  { icon: Leaf, title: 'Responsibly Made', text: 'Vegetable-tanned leathers' },
]

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

export function CatalogView() {
  const { data: products, isLoading } = useProducts()
  const category = useUI((s) => s.category)
  const setCategory = useUI((s) => s.setCategory)
  const query = useUI((s) => s.query)
  const setQuery = useUI((s) => s.setQuery)
  const navigate = useUI((s) => s.navigate)
  const [sort, setSort] = useState('featured')

  const categories = ['all', ...new Set((products ?? []).map((p) => p.category.slug))]
  const categoryNames: Record<string, string> = {
    all: 'All Bags',
    totes: 'Tote Bags',
    shoulder: 'Shoulder Bags',
    crossbody: 'Crossbody',
    clutches: 'Clutches',
  }

  const featured = (products ?? []).filter((p) => p.featured).slice(0, 4)

  let listing = (products ?? []).filter((p) => category === 'all' || p.category.slug === category)
  if (query.trim()) {
    const q = query.trim().toLowerCase()
    listing = listing.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    )
  }
  listing = [...listing]
  if (sort === 'price-asc') listing.sort((a, b) => a.price - b.price)
  else if (sort === 'price-desc') listing.sort((a, b) => b.price - a.price)
  else if (sort === 'rating') listing.sort((a, b) => b.rating - a.rating)
  else listing.sort((a, b) => Number(b.featured) - Number(a.featured))

  const scrollToShop = () => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div>
      {/* ---------- Hero ---------- */}
      <section className="relative h-[440px] w-full overflow-hidden sm:h-[540px]">
        <Image
          src="/hero.jpg"
          alt="ENCETT leather bag collection editorial"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="max-w-xl text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/85">
                New Season · Autumn 2026
              </p>
              <h1 className="mt-4 font-display text-4xl font-medium leading-[1.1] sm:text-6xl">
                Carry elegance,
                <br />
                every day.
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
                Handcrafted leather bags in silhouettes that outlast trends — from roomy totes to
                evening clutches that catch the light.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={scrollToShop}
                  className="bg-brand text-brand-foreground hover:bg-brand/90"
                >
                  Shop the Collection <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    setCategory('clutches')
                    scrollToShop()
                  }}
                  className="border-white/60 bg-transparent text-white hover:bg-white/15 hover:text-white"
                >
                  Evening Edit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Value props ---------- */}
      <section className="border-b bg-cream">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-7 sm:px-6 lg:grid-cols-4">
          {VALUE_PROPS.map((prop) => (
            <div key={prop.title} className="flex items-center gap-3">
              <prop.icon className="h-5 w-5 shrink-0 text-brand" aria-hidden />
              <div>
                <p className="text-[13px] font-semibold">{prop.title}</p>
                <p className="text-xs text-muted-foreground">{prop.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Featured ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">
              Handpicked
            </p>
            <h2 className="mt-2 font-display text-3xl font-medium">Featured this week</h2>
          </div>
          <Button
            variant="ghost"
            className="hidden text-brand hover:bg-brand/10 hover:text-brand sm:inline-flex"
            onClick={() => {
              setCategory('all')
              setQuery('')
              scrollToShop()
            }}
          >
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-[4/5] w-full rounded-lg" />
                  <Skeleton className="mt-3 h-4 w-2/3" />
                  <Skeleton className="mt-2 h-4 w-1/3" />
                </div>
              ))
            : featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ---------- Promo tiles ---------- */}
      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-14 sm:px-6 md:grid-cols-2">
        {[
          {
            image: '/lifestyle-autumn.jpg',
            eyebrow: 'The Everyday Edit',
            title: 'Totes built for busy days',
            slug: 'totes',
          },
          {
            image: '/lifestyle-evening.jpg',
            eyebrow: 'The Evening Edit',
            title: 'Clutches that catch the light',
            slug: 'clutches',
          },
        ].map((tile) => (
          <button
            key={tile.slug}
            onClick={() => {
              setCategory(tile.slug)
              setQuery('')
              scrollToShop()
            }}
            className="group relative h-64 overflow-hidden rounded-lg text-left md:h-72"
            aria-label={`Shop ${tile.eyebrow}`}
          >
            <Image
              src={tile.image}
              alt={tile.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/85">
                {tile.eyebrow}
              </p>
              <h3 className="mt-1.5 font-display text-2xl font-medium">{tile.title}</h3>
              <span className="mt-3 inline-flex items-center text-sm font-medium underline-offset-4 group-hover:underline">
                Shop now <ArrowRight className="ml-1.5 h-4 w-4" />
              </span>
            </div>
          </button>
        ))}
      </section>

      {/* ---------- Shop all ---------- */}
      <section id="shop" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-20 sm:px-6">
        <div className="flex flex-col gap-5 border-t pt-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">
              {category === 'all' ? 'The Collection' : categoryNames[category] ?? 'Collection'}
            </p>
            <h2 className="mt-2 font-display text-3xl font-medium">
              {query.trim() ? `Results for “${query.trim()}”` : 'Shop all bags'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {listing.length} item{listing.length === 1 ? '' : 's'}
            </span>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[180px]" aria-label="Sort products">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                {SORTS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* category chips */}
        <div className="thin-scrollbar -mx-1 mt-6 flex gap-2 overflow-x-auto px-1 pb-1">
          {categories.map((slug) => (
            <button
              key={slug}
              onClick={() => setCategory(slug)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                category === slug
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-foreground/75 hover:border-foreground/40 hover:text-foreground'
              }`}
              aria-pressed={category === slug}
            >
              {categoryNames[slug] ?? slug}
            </button>
          ))}
        </div>

        {/* grid */}
        {isLoading ? (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 lg:grid-cols-4 lg:gap-x-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-[4/5] w-full rounded-lg" />
                <Skeleton className="mt-3 h-4 w-2/3" />
                <Skeleton className="mt-2 h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : listing.length === 0 ? (
          <div className="mt-10 rounded-lg border border-dashed py-16 text-center">
            <p className="font-display text-xl font-medium">No bags found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different search or browse the full collection.
            </p>
            <Button
              className="mt-5 bg-brand text-brand-foreground hover:bg-brand/90"
              onClick={() => {
                setQuery('')
                setCategory('all')
              }}
            >
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 lg:grid-cols-4 lg:gap-x-6">
            {listing.map((p: ShopProduct) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
