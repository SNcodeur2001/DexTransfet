import { PrismaService } from '../config/prisma.service';
import { TransferEntity } from './entities/transfer.entity';
import { FilterTransferDto } from './dto/filter-transfer.dto';
export declare class TransfersRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        reference: string;
        amount: number;
        fees: number;
        total: number;
        currency: string;
        channel: string;
        recipient: any;
        metadata?: any;
    }): Promise<TransferEntity>;
    findById(id: string): Promise<TransferEntity | null>;
    findByReference(reference: string): Promise<TransferEntity | null>;
    findMany(filter: FilterTransferDto): Promise<{
        items: TransferEntity[];
        nextCursor?: string;
    }>;
    updateStatus(id: string, status: string, providerRef?: string, errorCode?: string): Promise<TransferEntity>;
}
