import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateProductDto) {
    return this.prisma.product
      .create({ data: dto, include: { category: true } })
      .catch((error: unknown) => this.handlePrismaError(error));
  }

  findAll(categoryId?: string, includeUnavailable = false) {
    return this.prisma.product.findMany({
      where: {
        categoryId,
        isAvailable: includeUnavailable ? undefined : true,
      },
      include: { category: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);

    return this.prisma.product
      .update({ where: { id }, data: dto, include: { category: true } })
      .catch((error: unknown) => this.handlePrismaError(error));
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: { isAvailable: false },
      include: { category: true },
    });
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException('Product slug already exists');
      }

      if (error.code === 'P2003') {
        throw new NotFoundException('Category not found');
      }
    }

    throw error;
  }
}
