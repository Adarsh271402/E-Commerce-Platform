import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const q = searchParams.get('q')

    const products = await db.product.findMany({
      where: {
        ...(category && category !== 'all' ? { category: { slug: category } } : {}),
        ...(q ? { name: { contains: q } } : {}),
      },
      include: { category: true },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ products })
  } catch (e) {
    console.error('products error', e)
    return NextResponse.json({ error: 'Failed to load products.' }, { status: 500 })
  }
}
