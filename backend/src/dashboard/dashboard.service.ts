import { Injectable } from '@nestjs/common';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const [
      usersCount,
      productsCount,
      pendingOrdersCount,
      deliveredOrdersCount,
      paidPayments,
      recentOrders,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      this.prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
      this.prisma.payment.findMany({ where: { status: PaymentStatus.PAID } }),
      this.prisma.order.findMany({
        take: 5,
        include: { items: true, payment: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const revenueCents = paidPayments.reduce(
      (total, payment) => total + payment.amountCents,
      0,
    );

    return {
      usersCount,
      productsCount,
      pendingOrdersCount,
      deliveredOrdersCount,
      revenueCents,
      recentOrders,
    };
  }
}
