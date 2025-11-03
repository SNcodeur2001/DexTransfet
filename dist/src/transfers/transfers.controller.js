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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransfersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const transfers_service_1 = require("./transfers.service");
const create_transfer_dto_1 = require("./dto/create-transfer.dto");
const filter_transfer_dto_1 = require("./dto/filter-transfer.dto");
const api_key_guard_1 = require("../common/guards/api-key.guard");
let TransfersController = class TransfersController {
    transfersService;
    constructor(transfersService) {
        this.transfersService = transfersService;
    }
    create(createTransferDto) {
        return this.transfersService.create(createTransferDto);
    }
    findAll(filter) {
        return this.transfersService.findAll(filter);
    }
    findOne(id) {
        return this.transfersService.findOne(id);
    }
    process(id) {
        return this.transfersService.process(id);
    }
    cancel(id) {
        return this.transfersService.cancel(id);
    }
};
exports.TransfersController = TransfersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new transfer',
        description: 'Initiate a money transfer to a recipient. The transfer will be created with a pending status and can be processed later.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Transfer created successfully',
        schema: {
            example: {
                id: 'cm5tZ3N0MDAwMDAwMDAwMDAwMDAw',
                reference: 'TXN-1730600000000-001',
                amount: 10000,
                fees: 250,
                total: 10250,
                currency: 'XOF',
                channel: 'mobile',
                status: 'pending',
                recipient: {
                    phone: '+221771234567',
                    name: 'John Doe'
                },
                metadata: {
                    reference: 'TXN-12345',
                    description: 'Payment for services'
                },
                providerRef: null,
                errorCode: null,
                createdAt: '2025-11-03T03:13:20.000Z',
                updatedAt: '2025-11-03T03:13:20.000Z'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Invalid API key' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transfer_dto_1.CreateTransferDto]),
    __metadata("design:returntype", void 0)
], TransfersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all transfers with filtering and pagination',
        description: 'Retrieve a paginated list of transfers with optional filtering by status, channel, amount range, and search query.'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        description: 'Filter by transfer status',
        enum: ['pending', 'processing', 'completed', 'failed', 'cancelled']
    }),
    (0, swagger_1.ApiQuery)({
        name: 'channel',
        required: false,
        description: 'Filter by transfer channel',
        example: 'mobile'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'minAmount',
        required: false,
        type: Number,
        description: 'Minimum transfer amount',
        example: 1000
    }),
    (0, swagger_1.ApiQuery)({
        name: 'maxAmount',
        required: false,
        type: Number,
        description: 'Maximum transfer amount',
        example: 100000
    }),
    (0, swagger_1.ApiQuery)({
        name: 'q',
        required: false,
        description: 'Search query (searches in reference, recipient name, etc.)',
        example: 'John'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Number of results per page',
        example: 20
    }),
    (0, swagger_1.ApiQuery)({
        name: 'cursor',
        required: false,
        description: 'Cursor for pagination',
        example: 'cm5tZ3N0MDAwMDAwMDAwMDAwMDAw'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of transfers with pagination info',
        schema: {
            example: {
                data: [
                    {
                        id: 'cm5tZ3N0MDAwMDAwMDAwMDAwMDAw',
                        reference: 'TXN-1730600000000-001',
                        amount: 10000,
                        fees: 250,
                        total: 10250,
                        currency: 'XOF',
                        channel: 'mobile',
                        status: 'completed',
                        recipient: {
                            phone: '+221771234567',
                            name: 'John Doe'
                        },
                        metadata: null,
                        providerRef: 'PROV-123456',
                        errorCode: null,
                        createdAt: '2025-11-03T03:13:20.000Z',
                        updatedAt: '2025-11-03T03:13:25.000Z'
                    }
                ],
                pagination: {
                    hasNextPage: true,
                    nextCursor: 'cm5tZ3N0MDAwMDAwMDAwMDAwMDAx',
                    limit: 20
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Invalid API key' }),
    __param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_transfer_dto_1.FilterTransferDto]),
    __metadata("design:returntype", void 0)
], TransfersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a transfer by ID',
        description: 'Retrieve detailed information about a specific transfer using its unique identifier.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Unique transfer identifier',
        example: 'cm5tZ3N0MDAwMDAwMDAwMDAwMDAw'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Transfer found',
        schema: {
            example: {
                id: 'cm5tZ3N0MDAwMDAwMDAwMDAwMDAw',
                reference: 'TXN-1730600000000-001',
                amount: 10000,
                fees: 250,
                total: 10250,
                currency: 'XOF',
                channel: 'mobile',
                status: 'completed',
                recipient: {
                    phone: '+221771234567',
                    name: 'John Doe'
                },
                metadata: {
                    reference: 'TXN-12345',
                    description: 'Payment for services'
                },
                providerRef: 'PROV-123456',
                errorCode: null,
                createdAt: '2025-11-03T03:13:20.000Z',
                updatedAt: '2025-11-03T03:13:25.000Z'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Transfer not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Invalid API key' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TransfersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/process'),
    (0, swagger_1.ApiOperation)({
        summary: 'Process a transfer',
        description: 'Submit the transfer to the payment provider for processing. The transfer status will change to "processing" and eventually to "completed" or "failed".'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Unique transfer identifier',
        example: 'cm5tZ3N0MDAwMDAwMDAwMDAwMDAw'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Transfer processing initiated',
        schema: {
            example: {
                id: 'cm5tZ3N0MDAwMDAwMDAwMDAwMDAw',
                reference: 'TXN-1730600000000-001',
                amount: 10000,
                fees: 250,
                total: 10250,
                currency: 'XOF',
                channel: 'mobile',
                status: 'processing',
                recipient: {
                    phone: '+221771234567',
                    name: 'John Doe'
                },
                metadata: null,
                providerRef: 'PROV-123456',
                errorCode: null,
                createdAt: '2025-11-03T03:13:20.000Z',
                updatedAt: '2025-11-03T03:13:25.000Z'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Transfer not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Transfer cannot be processed (not in pending status)' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Invalid API key' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TransfersController.prototype, "process", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, swagger_1.ApiOperation)({
        summary: 'Cancel a transfer',
        description: 'Cancel a pending transfer. Only transfers with "pending" status can be cancelled.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Unique transfer identifier',
        example: 'cm5tZ3N0MDAwMDAwMDAwMDAwMDAw'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Transfer cancelled successfully',
        schema: {
            example: {
                id: 'cm5tZ3N0MDAwMDAwMDAwMDAwMDAw',
                reference: 'TXN-1730600000000-001',
                amount: 10000,
                fees: 250,
                total: 10250,
                currency: 'XOF',
                channel: 'mobile',
                status: 'cancelled',
                recipient: {
                    phone: '+221771234567',
                    name: 'John Doe'
                },
                metadata: null,
                providerRef: null,
                errorCode: null,
                createdAt: '2025-11-03T03:13:20.000Z',
                updatedAt: '2025-11-03T03:13:30.000Z'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Transfer not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Transfer cannot be cancelled (not in pending status)' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Invalid API key' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TransfersController.prototype, "cancel", null);
exports.TransfersController = TransfersController = __decorate([
    (0, swagger_1.ApiTags)('transfers'),
    (0, common_1.Controller)('transfers'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, swagger_1.ApiHeader)({
        name: 'x-api-key',
        description: 'API Key for authentication',
        required: true,
    }),
    __metadata("design:paramtypes", [transfers_service_1.TransfersService])
], TransfersController);
//# sourceMappingURL=transfers.controller.js.map