import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePaymentDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.payment
      .create({
        data: {
          orderId: dto.orderId,
          provider: dto.provider,
          method: dto.method,
          amountCents: dto.amountCents,
          currency: dto.currency ?? 'USD',
          providerTransactionId: dto.providerTransactionId,
          status: PaymentStatus.PENDING,
        },
        include: { order: true },
      })
      .catch((error: unknown) => {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new ConflictException('Payment already exists for this order');
        }
        throw error;
      });
  }

  findAll() {
    return this.prisma.payment.findMany({
      include: { order: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async updateStatus(id: string, dto: UpdatePaymentStatusDto) {
    await this.findOne(id);

    return this.prisma.payment.update({
      where: { id },
      data: {
        status: dto.status,
        providerTransactionId: dto.providerTransactionId,
        paidAt: dto.status === PaymentStatus.PAID ? new Date() : undefined,
      },
      include: { order: true },
    });
  }
}
