'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUI } from '@/store/ui'
import { useAuth } from '@/store/auth'

export function Footer() {
  const navigate = useUI((s) => s.navigate)
  const setCategory = useUI((s) => s.setCategory)
  const user = useAuth((s) => s.user)
  const [email, setEmail] = useState('')

  const subscribe = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.')
      return
    }
    toast.success('Welcome to the ENCETT list — 10% off your first order is on its way.')
    setEmail('')
  }

  const goCategory = (slug: string) => {
    setCategory(slug)
    navigate('catalog')
  }

  return (
    <footer className="mt-auto border-t bg-[#1c1917] text-stone-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* brand */}
          <div>
            <p className="font-display text-2xl font-semibold tracking-[0.3em] text-white">ENCETT</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-400">
              Timeless leather goods, crafted to be carried for decades — not seasons. Designed in-house, made by artisan partners.
            </p>
          </div>

          {/* shop */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white">Shop</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><button className="hover:text-white" onClick={() => goCategory('totes')}>Tote Bags</button></li>
              <li><button className="hover:text-white" onClick={() => goCategory('shoulder')}>Shoulder Bags</button></li>
              <li><button className="hover:text-white" onClick={() => goCategory('crossbody')}>Crossbody</button></li>
              <li><button className="hover:text-white" onClick={() => goCategory('clutches')}>Clutches</button></li>
            </ul>
          </div>

          {/* account */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white">Account</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><button className="hover:text-white" onClick={() => navigate(user ? 'orders' : 'auth')}>{user ? 'My Orders' : 'Sign in'}</button></li>
              <li><button className="hover:text-white" onClick={() => navigate('cart')}>Shopping Bag</button></li>
              <li><button className="hover:text-white" onClick={() => navigate(user ? 'orders' : 'auth')}>{user ? 'Track a Package' : 'Create Account'}</button></li>
            </ul>
          </div>

          {/* newsletter */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
              Stay in touch
            </h3>
            <p className="mt-4 text-sm text-stone-400">
              New arrivals, styling notes and 10% off your first order.
            </p>
            <div className="mt-4 flex gap-2">
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && subscribe()}
                placeholder="Email address"
                className="border-stone-700 bg-stone-900 text-white placeholder:text-stone-500 focus-visible:ring-brand"
                aria-label="Email for newsletter"
              />
              <Button onClick={subscribe} className="bg-brand text-brand-foreground hover:bg-brand/90">
                Join
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-stone-800 pt-6 text-xs text-stone-500 sm:flex-row">
          <p>© {new Date().getFullYear()} ENCETT. All rights reserved.</p>
          <p>Secure checkout · Visa · Mastercard · Amex · PayPal</p>
        </div>
      </div>
    </footer>
  )
}
