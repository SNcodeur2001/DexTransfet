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
    (0, swagger_1.ApiOperation)({ summary: 'Create a new transfer' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Transfer created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transfer_dto_1.CreateTransferDto]),
    __metadata("design:returntype", void 0)
], TransfersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all transfers with filtering and pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'channel', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'minAmount', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'maxAmount', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'cursor', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of transfers' }),
    __param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_transfer_dto_1.FilterTransferDto]),
    __metadata("design:returntype", void 0)
], TransfersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a transfer by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Transfer ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transfer found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Transfer not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TransfersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/process'),
    (0, swagger_1.ApiOperation)({ summary: 'Process a transfer' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Transfer ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transfer processed' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Transfer not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Transfer cannot be processed' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TransfersController.prototype, "process", null);
__decorate([
    (0, common_1.Post)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a transfer' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Transfer ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transfer cancelled' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Transfer not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Transfer cannot be cancelled' }),
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