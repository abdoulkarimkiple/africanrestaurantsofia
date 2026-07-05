import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCategoryDto) {
    return this.prisma.category
      .create({ data: dto })
      .catch((error: unknown) => this.handleUniqueSlug(error));
  }

  findAll(includeInactive = false) {
    return this.prisma.category.findMany({
      where: includeInactive ? undefined : { isActive: true },
      include: { products: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);

    return this.prisma.category
      .update({ where: { id }, data: dto })
      .catch((error: unknown) => this.handleUniqueSlug(error));
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
  }

  private handleUniqueSlug(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Category slug already exists');
    }

    throw error;
  }
}
