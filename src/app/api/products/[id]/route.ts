import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const product = await db.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { category: true },
    })
    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 })
    }
    return NextResponse.json({ product })
  } catch (e) {
    console.error('product detail error', e)
    return NextResponse.json({ error: 'Failed to load product.' }, { status: 500 })
  }
}
