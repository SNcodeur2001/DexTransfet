import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { FilterTransferDto } from './dto/filter-transfer.dto';
export declare class TransfersController {
    private readonly transfersService;
    constructor(transfersService: TransfersService);
    create(createTransferDto: CreateTransferDto): Promise<import("./entities/transfer.entity").TransferEntity>;
    findAll(filter: FilterTransferDto): Promise<{
        items: import("./entities/transfer.entity").TransferEntity[];
        nextCursor?: string;
    }>;
    findOne(id: string): Promise<import("./entities/transfer.entity").TransferEntity>;
    process(id: string): Promise<import("./entities/transfer.entity").TransferEntity>;
    cancel(id: string): Promise<import("./entities/transfer.entity").TransferEntity>;
}
