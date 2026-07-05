import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  categoryId!: string;

  @ApiProperty({ example: 'Jollof Rice Royal' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'jollof-rice-royal' })
  @IsString()
  slug!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty({ example: 2299 })
  @IsInt()
  @Min(0)
  priceCents!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ default: 25 })
  @IsOptional()
  @IsInt()
  @Min(1)
  preparationMinutes?: number;
}
