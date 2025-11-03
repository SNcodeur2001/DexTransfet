import { Controller, Get, Post, Body, Param, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiQuery, ApiParam } from '@nestjs/swagger';
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { FilterTransferDto } from './dto/filter-transfer.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@ApiTags('transfers')
@Controller('transfers')
@UseGuards(ApiKeyGuard)
@ApiHeader({
  name: 'x-api-key',
  description: 'API Key for authentication',
  required: true,
})
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transfer' })
  @ApiResponse({ status: 201, description: 'Transfer created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body(ValidationPipe) createTransferDto: CreateTransferDto) {
    return this.transfersService.create(createTransferDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transfers with filtering and pagination' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'channel', required: false })
  @ApiQuery({ name: 'minAmount', required: false, type: Number })
  @ApiQuery({ name: 'maxAmount', required: false, type: Number })
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiResponse({ status: 200, description: 'List of transfers' })
  findAll(@Query(new ValidationPipe({ transform: true })) filter: FilterTransferDto) {
    return this.transfersService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a transfer by ID' })
  @ApiParam({ name: 'id', description: 'Transfer ID' })
  @ApiResponse({ status: 200, description: 'Transfer found' })
  @ApiResponse({ status: 404, description: 'Transfer not found' })
  findOne(@Param('id') id: string) {
    return this.transfersService.findOne(id);
  }

  @Post(':id/process')
  @ApiOperation({ summary: 'Process a transfer' })
  @ApiParam({ name: 'id', description: 'Transfer ID' })
  @ApiResponse({ status: 200, description: 'Transfer processed' })
  @ApiResponse({ status: 404, description: 'Transfer not found' })
  @ApiResponse({ status: 409, description: 'Transfer cannot be processed' })
  process(@Param('id') id: string) {
    return this.transfersService.process(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a transfer' })
  @ApiParam({ name: 'id', description: 'Transfer ID' })
  @ApiResponse({ status: 200, description: 'Transfer cancelled' })
  @ApiResponse({ status: 404, description: 'Transfer not found' })
  @ApiResponse({ status: 409, description: 'Transfer cannot be cancelled' })
  cancel(@Param('id') id: string) {
    return this.transfersService.cancel(id);
  }
}