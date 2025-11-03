export declare class ProviderSimulator {
    processTransfer(transferId: string): Promise<{
        success: boolean;
        providerRef?: string;
        errorCode?: string;
    }>;
}
