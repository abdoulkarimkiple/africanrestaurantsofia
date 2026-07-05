import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    const productIds = dto.items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isAvailable: true },
    });

    if (products.length !== new Set(productIds).size) {
      throw new BadRequestException('One or more products are unavailable');
    }

    const settings = await this.prisma.restaurantSetting.findFirst();
    const productById = new Map(
      products.map((product) => [product.id, product]),
    );

    const orderItems = dto.items.map((item) => {
      const product = productById.get(item.productId);

      if (!product) {
        throw new BadRequestException('Invalid product');
      }

      return {
        productId: product.id,
        productName: product.name,
        unitPriceCents: product.priceCents,
        quantity: item.quantity,
        totalPriceCents: product.priceCents * item.quantity,
        notes: item.notes,
      };
    });

    const subtotalCents = orderItems.reduce(
      (total, item) => total + item.totalPriceCents,
      0,
    );
    const deliveryFeeCents = settings?.deliveryFeeCents ?? 0;
    const taxRateBasisPoints = settings?.taxRateBasisPoints ?? 0;
    const taxCents = Math.round((subtotalCents * taxRateBasisPoints) / 10000);
    const totalCents = subtotalCents + deliveryFeeCents + taxCents;

    return this.prisma.order.create({
      data: {
        customerId: dto.customerId,
        orderNumber: await this.generateOrderNumber(),
        customerEmail: dto.customerEmail,
        customerFirstName: dto.customerFirstName,
        customerLastName: dto.customerLastName,
        customerPhone: dto.customerPhone,
        deliveryAddressLine1: dto.deliveryAddressLine1,
        deliveryAddressLine2: dto.deliveryAddressLine2,
        deliveryCity: dto.deliveryCity,
        deliveryState: dto.deliveryState ?? 'NY',
        deliveryPostalCode: dto.deliveryPostalCode,
        subtotalCents,
        deliveryFeeCents,
        taxCents,
        totalCents,
        notes: dto.notes,
        items: { create: orderItems },
      },
      include: {
        items: true,
        payment: true,
      },
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      include: { items: true, payment: true, customer: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true, payment: true, customer: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    await this.findOne(id);

    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
      include: { items: true, payment: true },
    });
  }

  findByCustomer(customerId: string) {
    return this.prisma.order.findMany({
      where: { customerId },
      include: { items: true, payment: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async generateOrderNumber(): Promise<string> {
    const datePart = new Date().toISOString().slice(0, 10).replaceAll('-', '');
    const count = await this.prisma.order.count();
    return `ARS-${datePart}-${String(count + 1).padStart(5, '0')}`;
  }
}
