export type ShopUser = {
  id: string
  name: string
  email: string
  role: string
}

export type ShopCategory = {
  id: string
  name: string
  slug: string
  tagline: string
}

export type ShopProduct = {
  id: string
  name: string
  slug: string
  description: string
  details: string
  price: number
  imageUrl: string
  stock: number
  rating: number
  reviewCount: number
  featured: boolean
  isNew: boolean
  category: ShopCategory
}

export type ShopOrderItem = {
  id: string
  productId: string
  quantity: number
  price: number
  name: string
  imageUrl: string
}

export type ShopOrder = {
  id: string
  orderNo: string
  status: string
  total: number
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  zip: string
  items: ShopOrderItem[]
  createdAt: string
}

export type CartLine = {
  productId: string
  slug: string
  name: string
  price: number
  imageUrl: string
  stock: number
  quantity: number
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}
