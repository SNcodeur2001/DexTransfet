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
exports.FilterTransferDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class FilterTransferDto {
    status;
    channel;
    minAmount;
    maxAmount;
    q;
    limit = 20;
    cursor;
}
exports.FilterTransferDto = FilterTransferDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by transfer status',
        example: 'pending',
        enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterTransferDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by transfer channel',
        example: 'mobile',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterTransferDto.prototype, "channel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Minimum transfer amount',
        example: 1000,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], FilterTransferDto.prototype, "minAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum transfer amount',
        example: 100000,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], FilterTransferDto.prototype, "maxAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search query (searches in reference, recipient name, etc.)',
        example: 'John',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterTransferDto.prototype, "q", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of results per page',
        example: 20,
        minimum: 1,
        default: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], FilterTransferDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Cursor for pagination',
        example: 'cm5tZ3N0MDAwMDAwMDAwMDAwMDAw',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterTransferDto.prototype, "cursor", void 0);
//# sourceMappingURL=filter-transfer.dto.js.map