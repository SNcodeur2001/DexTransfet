import { IsInt, IsString, IsObject, IsOptional, Min, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransferDto {
  @ApiProperty({
    description: 'Transfer amount in the smallest currency unit (e.g., cents for USD)',
    example: 10000,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  amount: number;

  @ApiProperty({
    description: 'Currency code (ISO 4217)',
    example: 'XOF',
    maxLength: 3,
  })
  @IsString()
  @MaxLength(3)
  currency: string;

  @ApiProperty({
    description: 'Transfer channel (e.g., mobile, bank, card)',
    example: 'mobile',
  })
  @IsString()
  channel: string;

  @ApiProperty({
    description: 'Recipient information',
    example: {
      phone: '+221771234567',
      name: 'John Doe',
    },
  })
  @IsObject()
  recipient: {
    phone: string;
    name: string;
  };

  @ApiPropertyOptional({
    description: 'Additional metadata for the transfer',
    example: {
      reference: 'TXN-12345',
      description: 'Payment for services',
    },
  })
  @IsOptional()
  @IsObject()
  metadata?: any;
}