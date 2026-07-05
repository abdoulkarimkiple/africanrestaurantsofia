import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Plats signatures' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'plats-signatures' })
  @IsString()
  slug!: string;

  @ApiPropertyOptional({
    example: 'Recettes premium preparees pour la livraison.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/category.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
