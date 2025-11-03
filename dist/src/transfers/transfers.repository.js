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
exports.TransfersRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../config/prisma.service");
let TransfersRepository = class TransfersRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.transfer.create({
            data: {
                ...data,
                status: 'PENDING',
            },
        });
    }
    async findById(id) {
        return this.prisma.transfer.findUnique({ where: { id } });
    }
    async findByReference(reference) {
        return this.prisma.transfer.findUnique({ where: { reference } });
    }
    async findMany(filter) {
        const { limit = 20, cursor, ...where } = filter;
        const whereClause = {};
        if (where.status)
            whereClause.status = where.status;
        if (where.channel)
            whereClause.channel = where.channel;
        if (where.minAmount || where.maxAmount) {
            whereClause.amount = {};
            if (where.minAmount)
                whereClause.amount.gte = where.minAmount;
            if (where.maxAmount)
                whereClause.amount.lte = where.maxAmount;
        }
        if (where.q) {
            whereClause.OR = [
                { reference: { contains: where.q, mode: 'insensitive' } },
                { recipient: { path: ['name'], string_contains: where.q } },
            ];
        }
        const items = await this.prisma.transfer.findMany({
            where: whereClause,
            take: limit + 1,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { createdAt: 'desc' },
        });
        let nextCursor;
        if (items.length > limit) {
            nextCursor = items[limit].id;
            items.pop();
        }
        return { items: items, nextCursor };
    }
    async updateStatus(id, status, providerRef, errorCode) {
        return this.prisma.transfer.update({
            where: { id },
            data: { status, providerRef, errorCode },
        });
    }
};
exports.TransfersRepository = TransfersRepository;
exports.TransfersRepository = TransfersRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransfersRepository);
//# sourceMappingURL=transfers.repository.js.map