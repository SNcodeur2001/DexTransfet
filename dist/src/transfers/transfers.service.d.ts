import { TransfersRepository } from './transfers.repository';
import { ProviderSimulator } from './provider.simulator';
import { AuditService } from '../audit/audit.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { FilterTransferDto } from './dto/filter-transfer.dto';
export declare class TransfersService {
    private repository;
    private providerSimulator;
    private auditService;
    constructor(repository: TransfersRepository, providerSimulator: ProviderSimulator, auditService: AuditService);
    private calculateFees;
    private generateReference;
    create(createTransferDto: CreateTransferDto): Promise<import("./entities/transfer.entity").TransferEntity>;
    findAll(filter: FilterTransferDto): Promise<{
        items: import("./entities/transfer.entity").TransferEntity[];
        nextCursor?: string;
    }>;
    findOne(id: string): Promise<import("./entities/transfer.entity").TransferEntity>;
    process(id: string): Promise<import("./entities/transfer.entity").TransferEntity>;
    cancel(id: string): Promise<import("./entities/transfer.entity").TransferEntity>;
}
