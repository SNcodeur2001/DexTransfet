import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { TransferEntity } from './entities/transfer.entity';
import { FilterTransferDto } from './dto/filter-transfer.dto';

@Injectable()
export class TransfersRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    reference: string;
    amount: number;
    fees: number;
    total: number;
    currency: string;
    channel: string;
    recipient: any;
    metadata?: any;
  }): Promise<TransferEntity> {
    return this.prisma.transfer.create({ data });
  }

  async findById(id: string): Promise<TransferEntity | null> {
    return this.prisma.transfer.findUnique({ where: { id } });
  }

  async findByReference(reference: string): Promise<TransferEntity | null> {
    return this.prisma.transfer.findUnique({ where: { reference } });
  }

  async findMany(filter: FilterTransferDto): Promise<{ items: TransferEntity[]; nextCursor?: string }> {
    const { limit = 20, cursor, ...where } = filter;

    const whereClause: any = {};

    if (where.status) whereClause.status = where.status;
    if (where.channel) whereClause.channel = where.channel;
    if (where.minAmount || where.maxAmount) {
      whereClause.amount = {};
      if (where.minAmount) whereClause.amount.gte = where.minAmount;
      if (where.maxAmount) whereClause.amount.lte = where.maxAmount;
    }
    if (where.q) {
      whereClause.OR = [
        { reference: { contains: where.q, mode: 'insensitive' } },
        { recipient: { path: ['name'], string_contains: where.q } },
      ];
    }

    const items = await this.prisma.transfer.findMany({
      where: whereClause,
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    let nextCursor: string | undefined;
    if (items.length > limit) {
      nextCursor = items[limit].id;
      items.pop();
    }

    return { items, nextCursor };
  }

  async updateStatus(id: string, status: string, providerRef?: string, errorCode?: string): Promise<TransferEntity> {
    return this.prisma.transfer.update({
      where: { id },
      data: { status, providerRef, errorCode },
    });
  }
}