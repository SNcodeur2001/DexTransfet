import { Injectable } from '@nestjs/common';

@Injectable()
export class ProviderSimulator {
  async processTransfer(transferId: string): Promise<{ success: boolean; providerRef?: string; errorCode?: string }> {
    // Simulate processing delay (2-3 seconds)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 2000));

    // 70% success rate
    const isSuccess = Math.random() < 0.7;

    if (isSuccess) {
      return {
        success: true,
        providerRef: `PROV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
    } else {
      return {
        success: false,
        errorCode: 'INSUFFICIENT_FUNDS', // or other error codes
      };
    }
  }
}