"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransfersService = void 0;
const common_1 = require("@nestjs/common");
const transfers_repository_1 = require("./transfers.repository");
const provider_simulator_1 = require("./provider.simulator");
const audit_service_1 = require("../audit/audit.service");
let TransfersService = class TransfersService {
    repository;
    providerSimulator;
    auditService;
    constructor(repository, providerSimulator, auditService) {
        this.repository = repository;
        this.providerSimulator = providerSimulator;
        this.auditService = auditService;
    }
    calculateFees(amount) {
        const baseFees = Math.ceil(amount * 0.008);
        return Math.max(100, Math.min(baseFees, 1500));
    }
    generateReference() {
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        return `TRF-${date}-${random}`;
    }
    async create(createTransferDto) {
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
    async findAll(filter) {
        return this.repository.findMany(filter);
    }
    async findOne(id) {
        const transfer = await this.repository.findById(id);
        if (!transfer) {
            throw new common_1.NotFoundException('Transfer not found');
        }
        return transfer;
    }
    async process(id) {
        const transfer = await this.findOne(id);
        if (transfer.status !== 'PENDING') {
            throw new common_1.ConflictException('Transfer is not in PENDING status');
        }
        await this.repository.updateStatus(id, 'PROCESSING');
        await this.auditService.log('TRANSFER_PROCESSING', id);
        const result = await this.providerSimulator.processTransfer(id);
        if (result.success) {
            await this.repository.updateStatus(id, 'SUCCESS', result.providerRef);
            await this.auditService.log('TRANSFER_SUCCESS', id, { providerRef: result.providerRef });
        }
        else {
            await this.repository.updateStatus(id, 'FAILED', undefined, result.errorCode);
            await this.auditService.log('TRANSFER_FAILED', id, { errorCode: result.errorCode });
        }
        return this.findOne(id);
    }
    async cancel(id) {
        const transfer = await this.findOne(id);
        if (transfer.status !== 'PENDING') {
            throw new common_1.ConflictException('Only PENDING transfers can be cancelled');
        }
        await this.repository.updateStatus(id, 'CANCELLED');
        await this.auditService.log('TRANSFER_CANCELED', id);
        return this.findOne(id);
    }
};
exports.TransfersService = TransfersService;
exports.TransfersService = TransfersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transfers_repository_1.TransfersRepository,
        provider_simulator_1.ProviderSimulator,
        audit_service_1.AuditService])
], TransfersService);
//# sourceMappingURL=transfers.service.js.map