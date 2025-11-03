import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(action: string, transferId?: string, details?: any) {
    return this.prisma.audit.create({
      data: {
        action,
        transferId,
        details,
      },
    });
  }
}