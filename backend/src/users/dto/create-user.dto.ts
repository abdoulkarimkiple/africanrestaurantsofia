import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'client@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Client123!' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: 'Aminata' })
  @IsString()
  firstName!: string;

  @ApiProperty({ example: 'Diallo' })
  @IsString()
  lastName!: string;

  @ApiPropertyOptional({ example: '+12125550123' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.CUSTOMER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
