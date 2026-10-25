'use client'

import { useSyncExternalStore } from 'react'
import { Search, ShoppingBag, User, Menu, LogOut, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUI } from '@/store/ui'
import { useAuth } from '@/store/auth'
import { useCart, cartCount } from '@/store/cart'

const NAV_CATEGORIES = [
  { slug: 'all', label: 'All Bags' },
  { slug: 'totes', label: 'Tote Bags' },
  { slug: 'shoulder', label: 'Shoulder Bags' },
  { slug: 'crossbody', label: 'Crossbody' },
  { slug: 'clutches', label: 'Clutches' },
]

export function Header() {
  const navigate = useUI((s) => s.navigate)
  const view = useUI((s) => s.view)
  const query = useUI((s) => s.query)
  const setQuery = useUI((s) => s.setQuery)
  const setCategory = useUI((s) => s.setCategory)
  const openCart = useUI((s) => s.openCart)
  const setMenuOpen = useUI((s) => s.setMenuOpen)
  const menuOpen = useUI((s) => s.menuOpen)

  const user = useAuth((s) => s.user)
  const logout = useAuth((s) => s.logout)
  const lines = useCart((s) => s.lines)

  // Hydration-safe read of the persisted cart: server snapshot is always "not hydrated",
  // client snapshot flips once zustand-persist finishes rehydrating from localStorage.
  const cartHydrated = useSyncExternalStore(
    (onStoreChange) => useCart.persist.onFinishHydration(() => onStoreChange()),
    () => useCart.persist.hasHydrated(),
    () => false
  )

  const count = cartHydrated ? cartCount(lines) : 0

  const goShop = (slug: string) => {
    setCategory(slug)
    navigate('catalog')
  }

  const onSearch = (value: string) => {
    setQuery(value)
    if (value && view !== 'catalog') navigate('catalog')
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      {/* announcement bar */}
      <div className="bg-primary text-primary-foreground">
        <p className="mx-auto max-w-7xl px-4 py-1.5 text-center text-[11px] tracking-[0.18em] uppercase">
          Free shipping over $150 · 30-day easy returns
        </p>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        {/* mobile menu */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle className="font-display text-xl tracking-[0.25em]">ENCETT</SheetTitle>
            </SheetHeader>
            <nav className="mt-2 flex flex-col gap-1 px-2" aria-label="Mobile navigation">
              {NAV_CATEGORIES.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => goShop(c.slug)}
                  className="rounded-md px-3 py-2.5 text-left text-sm font-medium hover:bg-accent"
                >
                  {c.label}
                </button>
              ))}
              <div className="my-2 border-t" />
              <button
                onClick={() => navigate('orders')}
                className="rounded-md px-3 py-2.5 text-left text-sm font-medium hover:bg-accent"
              >
                My Orders
              </button>
              <button
                onClick={() => navigate(user ? 'orders' : 'auth')}
                className="rounded-md px-3 py-2.5 text-left text-sm font-medium hover:bg-accent"
              >
                {user ? user.name : 'Sign in'}
              </button>
            </nav>
          </SheetContent>
        </Sheet>

        {/* left nav (desktop) */}
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Main navigation">
          <button
            onClick={() => goShop('all')}
            className="text-sm font-medium tracking-wide text-foreground/80 transition-colors hover:text-foreground"
          >
            Shop
          </button>
          <button
            onClick={() => navigate('orders')}
            className="text-sm font-medium tracking-wide text-foreground/80 transition-colors hover:text-foreground"
          >
            Orders
          </button>
        </nav>

        {/* logo */}
        <button
          onClick={() => navigate('catalog')}
          className="absolute left-1/2 -translate-x-1/2"
          aria-label="ENCETT home"
        >
          <span className="font-display text-2xl font-semibold tracking-[0.35em]">ENCETT</span>
        </button>

        {/* right actions */}
        <div className="ml-auto flex items-center gap-1.5">
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search bags..."
              className="w-44 pl-8 transition-all focus-visible:w-64"
              aria-label="Search products"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Account">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {user ? (
                <>
                  <DropdownMenuLabel>
                    <div className="text-sm font-semibold">{user.name}</div>
                    <div className="text-xs font-normal text-muted-foreground">{user.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('orders')}>
                    <Package className="mr-2 h-4 w-4" /> My Orders
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('auth')}>
                    <User className="mr-2 h-4 w-4" /> Sign in
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('auth')}>
                    <Package className="mr-2 h-4 w-4" /> Create account
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={openCart}
            aria-label={`Open cart, ${count} items`}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-brand-foreground">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* mobile search row */}
      <div className="border-t px-4 py-2 md:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search bags..."
            className="pl-8"
            aria-label="Search products"
          />
        </div>
      </div>
    </header>
  )
}
