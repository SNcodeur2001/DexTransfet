export declare class CreateTransferDto {
    amount: number;
    currency: string;
    channel: string;
    recipient: {
        phone: string;
        name: string;
    };
    metadata?: any;
}
