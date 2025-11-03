import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { TransfersRepository } from './transfers.repository';
import { ProviderSimulator } from './provider.simulator';
import { AuditService } from '../audit/audit.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { FilterTransferDto } from './dto/filter-transfer.dto';

@Injectable()
export class TransfersService {
  constructor(
    private repository: TransfersRepository,
    private providerSimulator: ProviderSimulator,
    private auditService: AuditService,
  ) {}

  private calculateFees(amount: number): number {
    const baseFees = Math.ceil(amount * 0.008); // 0.8% rounded up
    return Math.max(100, Math.min(baseFees, 1500)); // min 100, max 1500
  }

  private generateReference(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `TRF-${date}-${random}`;
  }

  async create(createTransferDto: CreateTransferDto) {
    const { amount, currency, channel, recipient, metadata } = createTransferDto;

    const fees = this.calculateFees(amount);
    const total = amount + fees;
    const reference = this.generateReference();

    const transfer = await this.repository.create({
      reference,
      amount,
      fees,
      total,
      currency,
      channel,
      recipient,
      metadata,
    });

    await this.auditService.log('TRANSFER_CREATED', transfer.id);

    return transfer;
  }

  async findAll(filter: FilterTransferDto) {
    return this.repository.findMany(filter);
  }

  async findOne(id: string) {
    const transfer = await this.repository.findById(id);
    if (!transfer) {
      throw new NotFoundException('Transfer not found');
    }
    return transfer;
  }

  async process(id: string) {
    const transfer = await this.findOne(id);

    if (transfer.status !== 'PENDING') {
      throw new ConflictException('Transfer is not in PENDING status');
    }

    // Update to PROCESSING
    await this.repository.updateStatus(id, 'PROCESSING');
    await this.auditService.log('TRANSFER_PROCESSING', id);

    // Simulate provider processing
    const result = await this.providerSimulator.processTransfer(id);

    if (result.success) {
      await this.repository.updateStatus(id, 'SUCCESS', result.providerRef);
      await this.auditService.log('TRANSFER_SUCCESS', id, { providerRef: result.providerRef });
    } else {
      await this.repository.updateStatus(id, 'FAILED', undefined, result.errorCode);
      await this.auditService.log('TRANSFER_FAILED', id, { errorCode: result.errorCode });
    }

    return this.findOne(id);
  }

  async cancel(id: string) {
    const transfer = await this.findOne(id);

    if (transfer.status !== 'PENDING') {
      throw new ConflictException('Only PENDING transfers can be cancelled');
    }

    await this.repository.updateStatus(id, 'CANCELLED');
    await this.auditService.log('TRANSFER_CANCELED', id);

    return this.findOne(id);
  }
}