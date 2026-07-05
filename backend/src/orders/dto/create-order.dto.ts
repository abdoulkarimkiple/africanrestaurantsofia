import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateOrderItemDto {
  @ApiProperty()
  @IsString()
  productId!: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateOrderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({ example: 'client@example.com' })
  @IsEmail()
  customerEmail!: string;

  @ApiProperty({ example: 'Aminata' })
  @IsString()
  customerFirstName!: string;

  @ApiProperty({ example: 'Diallo' })
  @IsString()
  customerLastName!: string;

  @ApiProperty({ example: '+12125550123' })
  @IsString()
  customerPhone!: string;

  @ApiProperty({ example: '123 W 26th St' })
  @IsString()
  deliveryAddressLine1!: string;

  @ApiPropertyOptional({ example: 'Apt 5B' })
  @IsOptional()
  @IsString()
  deliveryAddressLine2?: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  deliveryCity!: string;

  @ApiPropertyOptional({ example: 'NY', default: 'NY' })
  @IsOptional()
  @IsString()
  deliveryState?: string;

  @ApiProperty({ example: '10001' })
  @IsString()
  deliveryPostalCode!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];
}
