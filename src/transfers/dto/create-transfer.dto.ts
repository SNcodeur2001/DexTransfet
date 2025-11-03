import { IsInt, IsString, IsObject, IsOptional, Min, MaxLength } from 'class-validator';

export class CreateTransferDto {
  @IsInt()
  @Min(1)
  amount: number;

  @IsString()
  @MaxLength(3)
  currency: string;

  @IsString()
  channel: string;

  @IsObject()
  recipient: {
    phone: string;
    name: string;
  };

  @IsOptional()
  @IsObject()
  metadata?: any;
}