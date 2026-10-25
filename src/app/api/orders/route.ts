import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserByToken, SESSION_COOKIE } from '@/lib/auth'

type IncomingItem = { productId: string; quantity: number }

function generateOrderNo(): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.floor(Math.random() * 46656)
    .toString(36)
    .toUpperCase()
    .padStart(3, '0')
  return `ENC-${ts}-${rand}`
}

export async function GET(req: NextRequest) {
  const user = await getUserByToken(req.cookies.get(SESSION_COOKIE)?.value)
  if (!user) {
    return NextResponse.json({ error: 'Please sign in to view your orders.' }, { status: 401 })
  }
  try {
    const orders = await db.order.findMany({
      where: { userId: user.id },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ orders })
  } catch (e) {
    console.error('orders list error', e)
    return NextResponse.json({ error: 'Failed to load orders.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = await getUserByToken(req.cookies.get(SESSION_COOKIE)?.value)
  if (!user) {
    return NextResponse.json(
      { error: 'Please sign in to place an order.' },
      { status: 401 }
    )
  }

  try {
    const body = await req.json()
    const { items, fullName, email, phone, address, city, zip } = body as {
      items: IncomingItem[]
      fullName?: string
      email?: string
      phone?: string
      address?: string
      city?: string
      zip?: string
    }

    // --- validate shipping info ---
    if (!fullName?.trim() || !email?.trim() || !address?.trim() || !city?.trim()) {
      return NextResponse.json(
        { error: 'Please fill in your name, email, address and city.' },
        { status: 400 }
      )
    }

    // --- validate items ---
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 })
    }
    const cleanItems = items
      .map((it) => ({
        productId: String(it.productId),
        quantity: Math.max(1, Math.min(99, Math.floor(Number(it.quantity) || 0))),
      }))
      .filter((it) => it.quantity > 0)
    if (cleanItems.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 })
    }

    // --- load products, verify stock, compute total from DB prices ---
    const ids = [...new Set(cleanItems.map((i) => i.productId))]
    const products = await db.product.findMany({ where: { id: { in: ids } } })
    const productMap = new Map(products.map((p) => [p.id, p]))

    for (const item of cleanItems) {
      const product = productMap.get(item.productId)
      if (!product) {
        return NextResponse.json(
          { error: 'One of the items in your cart is no longer available.' },
          { status: 400 }
        )
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Only ${product.stock} left of "${product.name}". Please adjust your cart.` },
          { status: 409 }
        )
      }
    }

    const total =
      Math.round(
        cleanItems.reduce((sum, it) => {
          const p = productMap.get(it.productId)!
          return sum + p.price * it.quantity
        }, 0) * 100
      ) / 100

    // --- create order + items, decrement stock, atomically ---
    const order = await db.$transaction(async (tx) => {
      for (const item of cleanItems) {
        const res = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        })
        if (res.count === 0) {
          throw new Error(`OUT_OF_STOCK:${item.productId}`)
        }
      }

      return tx.order.create({
        data: {
          orderNo: generateOrderNo(),
          status: 'PROCESSING',
          total,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: (phone || '').trim(),
          address: address.trim(),
          city: city.trim(),
          zip: (zip || '').trim(),
          userId: user.id,
          items: {
            create: cleanItems.map((it) => {
              const p = productMap.get(it.productId)!
              return {
                productId: p.id,
                quantity: it.quantity,
                price: p.price,
                name: p.name,
                imageUrl: p.imageUrl,
              }
            }),
          },
        },
        include: { items: true },
      })
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (e) {
    if (e instanceof Error && e.message.startsWith('OUT_OF_STOCK')) {
      return NextResponse.json(
        { error: 'An item just went out of stock. Please review your cart.' },
        { status: 409 }
      )
    }
    console.error('order create error', e)
    return NextResponse.json({ error: 'Failed to place order. Please try again.' }, { status: 500 })
  }
}
