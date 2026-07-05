import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UpdateRestaurantSettingDto } from './dto/update-restaurant-setting.dto';
import { RestaurantService } from './restaurant.service';

@ApiTags('Restaurant')
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get('settings')
  getSettings() {
    return this.restaurantService.getSettings();
  }

  @Patch('settings')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateSettings(@Body() dto: UpdateRestaurantSettingDto) {
    return this.restaurantService.updateSettings(dto);
  }
}
