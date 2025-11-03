export declare class TransferEntity {
    id: string;
    reference: string;
    amount: number;
    fees: number;
    total: number;
    currency: string;
    channel: string;
    status: string;
    recipient: any;
    metadata?: any;
    providerRef?: string;
    errorCode?: string;
    createdAt: Date;
    updatedAt: Date;
}
