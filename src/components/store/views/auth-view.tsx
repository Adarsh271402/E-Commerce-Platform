'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/store/auth'
import { useUI } from '@/store/ui'
import { toast } from 'sonner'

export function AuthView() {
  const login = useAuth((s) => s.login)
  const register = useAuth((s) => s.register)
  const navigate = useUI((s) => s.navigate)
  const pendingView = useUI((s) => s.pendingView)
  const setPendingView = useUI((s) => s.setPendingView)

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const afterAuth = () => {
    toast.success(pendingView ? 'Welcome back — your bag is saved.' : 'Welcome to ENCETT.')
    const dest = pendingView ?? 'catalog'
    setPendingView(null)
    navigate(dest)
  }

  const doLogin = async () => {
    setError(null)
    if (!loginForm.email.trim() || !loginForm.password) {
      setError('Please enter your email and password.')
      return
    }
    setBusy(true)
    const res = await login(loginForm.email, loginForm.password)
    setBusy(false)
    if (!res.ok) {
      setError(res.error ?? 'Sign in failed.')
      return
    }
    afterAuth()
  }

  const doRegister = async () => {
    setError(null)
    if (!registerForm.name.trim() || !registerForm.email.trim() || !registerForm.password) {
      setError('Please fill in all fields.')
      return
    }
    if (registerForm.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setBusy(true)
    const res = await register(registerForm.name, registerForm.email, registerForm.password)
    setBusy(false)
    if (!res.ok) {
      setError(res.error ?? 'Registration failed.')
      return
    }
    toast.success(`Account created. Nice to meet you, ${registerForm.name.split(' ')[0]}!`)
    const dest = pendingView ?? 'catalog'
    setPendingView(null)
    navigate(dest)
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <div className="text-center">
        <p className="font-display text-3xl font-semibold tracking-[0.3em]">ENCETT</p>
        <h1 className="mt-4 font-display text-2xl font-medium">Your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to check out faster, keep orders organized, and track deliveries.
        </p>
      </div>

      <Tabs defaultValue="login" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Sign in</TabsTrigger>
          <TabsTrigger value="register">Create account</TabsTrigger>
        </TabsList>

        {/* ----- login ----- */}
        <TabsContent value="login" className="mt-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                autoComplete="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={loginForm.password}
                onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && doLogin()}
                placeholder="••••••••"
              />
            </div>

            <button
              className="text-xs text-muted-foreground hover:text-foreground hover:underline"
              onClick={() => {
                setLoginForm({ email: 'demo@encett.com', password: 'demo1234' })
              }}
              type="button"
            >
              Use demo account (demo@encett.com)
            </button>

            {error && (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button
              className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
              onClick={doLogin}
              disabled={busy}
            >
              {busy ? 'Signing in…' : 'Sign in'}
            </Button>
          </div>
        </TabsContent>

        {/* ----- register ----- */}
        <TabsContent value="register" className="mt-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="reg-name">Full name</Label>
              <Input
                id="reg-name"
                autoComplete="name"
                value={registerForm.name}
                onChange={(e) => setRegisterForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Ava Laurent"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                autoComplete="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-password">Password</Label>
              <Input
                id="reg-password"
                type="password"
                autoComplete="new-password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm((f) => ({ ...f, password: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && doRegister()}
                placeholder="At least 8 characters"
              />
            </div>

            {error && (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button
              className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
              onClick={doRegister}
              disabled={busy}
            >
              {busy ? 'Creating account…' : 'Create account'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 space-y-2 rounded-lg border bg-card p-4">
        {[
          'Track orders and revisit your purchase history',
          '10% off your first order when you join',
          'Early access to new-season drops',
        ].map((perk) => (
          <p key={perk} className="flex items-start gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            {perk}
          </p>
        ))}
      </div>
    </div>
  )
}
