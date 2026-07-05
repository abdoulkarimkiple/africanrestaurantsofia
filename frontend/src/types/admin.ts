export type UserRole = 'ADMIN' | 'CUSTOMER'
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_DELIVERY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string | null
  role: UserRole
  isActive: boolean
  createdAt: string
}

export type Category = {
  id: string
  name: string
  slug: string
  description?: string | null
  imageUrl?: string | null
  sortOrder: number
  isActive: boolean
  products?: Product[]
}

export type Product = {
  id: string
  categoryId: string
  name: string
  slug: string
  description: string
  priceCents: number
  imageUrl?: string | null
  isAvailable: boolean
  isFeatured: boolean
  preparationMinutes: number
  category?: Category
}

export type OrderItem = {
  id: string
  productName: string
  quantity: number
  unitPriceCents: number
  totalPriceCents: number
}

export type Payment = {
  id: string
  status: PaymentStatus
  amountCents: number
  provider: string
  method: string
}

export type Order = {
  id: string
  orderNumber: string
  status: OrderStatus
  customerEmail: string
  customerFirstName: string
  customerLastName: string
  customerPhone: string
  deliveryCity: string
  deliveryPostalCode: string
  totalCents: number
  createdAt: string
  items: OrderItem[]
  payment?: Payment | null
}

export type RestaurantSetting = {
  id: string
  restaurantName: string
  phone: string
  email: string
  addressLine1: string
  addressLine2?: string | null
  city: string
  state: string
  postalCode: string
  deliveryRadiusMiles: number
  minimumOrderCents: number
  deliveryFeeCents: number
  taxRateBasisPoints: number
  isOrderingEnabled: boolean
}

export type DashboardSummary = {
  usersCount: number
  productsCount: number
  pendingOrdersCount: number
  deliveredOrdersCount: number
  revenueCents: number
  recentOrders: Order[]
}

