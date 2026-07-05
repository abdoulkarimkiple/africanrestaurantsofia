import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateRestaurantSettingDto } from './dto/update-restaurant-setting.dto';

@Injectable()
export class RestaurantService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings() {
    const settings = await this.prisma.restaurantSetting.findFirst();

    if (!settings) {
      throw new NotFoundException('Restaurant settings not found');
    }

    return settings;
  }

  async updateSettings(dto: UpdateRestaurantSettingDto) {
    const settings = await this.getSettings();

    return this.prisma.restaurantSetting.update({
      where: { id: settings.id },
      data: dto,
    });
  }
}
