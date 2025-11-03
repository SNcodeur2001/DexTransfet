import { PrismaService } from '../config/prisma.service';
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    log(action: string, transferId?: string, details?: any): Promise<{
        id: string;
        createdAt: Date;
        action: string;
        details: import("@prisma/client/runtime/library").JsonValue | null;
        transferId: string | null;
    }>;
}
