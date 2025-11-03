import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterTransferDto {
  @ApiPropertyOptional({
    description: 'Filter by transfer status',
    example: 'pending',
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Filter by transfer channel',
    example: 'mobile',
  })
  @IsOptional()
  @IsString()
  channel?: string;

  @ApiPropertyOptional({
    description: 'Minimum transfer amount',
    example: 1000,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minAmount?: number;

  @ApiPropertyOptional({
    description: 'Maximum transfer amount',
    example: 100000,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxAmount?: number;

  @ApiPropertyOptional({
    description: 'Search query (searches in reference, recipient name, etc.)',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description: 'Number of results per page',
    example: 20,
    minimum: 1,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Cursor for pagination',
    example: 'cm5tZ3N0MDAwMDAwMDAwMDAwMDAw',
  })
  @IsOptional()
  @IsString()
  cursor?: string;
}