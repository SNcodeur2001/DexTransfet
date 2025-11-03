"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderSimulator = void 0;
const common_1 = require("@nestjs/common");
let ProviderSimulator = class ProviderSimulator {
    async processTransfer(transferId) {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 2000));
        const isSuccess = Math.random() < 0.7;
        if (isSuccess) {
            return {
                success: true,
                providerRef: `PROV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            };
        }
        else {
            return {
                success: false,
                errorCode: 'INSUFFICIENT_FUNDS',
            };
        }
    }
};
exports.ProviderSimulator = ProviderSimulator;
exports.ProviderSimulator = ProviderSimulator = __decorate([
    (0, common_1.Injectable)()
], ProviderSimulator);
//# sourceMappingURL=provider.simulator.js.map