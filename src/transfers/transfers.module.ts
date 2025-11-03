import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { TransfersRepository } from './transfers.repository';
import { ProviderSimulator } from './provider.simulator';
import { PrismaService } from '../config/prisma.service';
import { AuditService } from '../audit/audit.service';

@Module({
  controllers: [TransfersController],
  providers: [TransfersService, TransfersRepository, ProviderSimulator, PrismaService, AuditService],
  exports: [TransfersService],
})
export class TransfersModule {}