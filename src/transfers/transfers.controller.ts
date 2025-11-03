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
  @ApiOperation({
    summary: 'Create a new transfer',
    description: 'Initiate a money transfer to a recipient. The transfer will be created with a pending status and can be processed later.'
  })
  @ApiResponse({
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
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  create(@Body(ValidationPipe) createTransferDto: CreateTransferDto) {
    return this.transfersService.create(createTransferDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all transfers with filtering and pagination',
    description: 'Retrieve a paginated list of transfers with optional filtering by status, channel, amount range, and search query.'
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by transfer status',
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled']
  })
  @ApiQuery({
    name: 'channel',
    required: false,
    description: 'Filter by transfer channel',
    example: 'mobile'
  })
  @ApiQuery({
    name: 'minAmount',
    required: false,
    type: Number,
    description: 'Minimum transfer amount',
    example: 1000
  })
  @ApiQuery({
    name: 'maxAmount',
    required: false,
    type: Number,
    description: 'Maximum transfer amount',
    example: 100000
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search query (searches in reference, recipient name, etc.)',
    example: 'John'
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of results per page',
    example: 20
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Cursor for pagination',
    example: 'cm5tZ3N0MDAwMDAwMDAwMDAwMDAw'
  })
  @ApiResponse({
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
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  findAll(@Query(new ValidationPipe({ transform: true })) filter: FilterTransferDto) {
    return this.transfersService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a transfer by ID',
    description: 'Retrieve detailed information about a specific transfer using its unique identifier.'
  })
  @ApiParam({
    name: 'id',
    description: 'Unique transfer identifier',
    example: 'cm5tZ3N0MDAwMDAwMDAwMDAwMDAw'
  })
  @ApiResponse({
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
  })
  @ApiResponse({ status: 404, description: 'Transfer not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  findOne(@Param('id') id: string) {
    return this.transfersService.findOne(id);
  }

  @Post(':id/process')
  @ApiOperation({
    summary: 'Process a transfer',
    description: 'Submit the transfer to the payment provider for processing. The transfer status will change to "processing" and eventually to "completed" or "failed".'
  })
  @ApiParam({
    name: 'id',
    description: 'Unique transfer identifier',
    example: 'cm5tZ3N0MDAwMDAwMDAwMDAwMDAw'
  })
  @ApiResponse({
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
  })
  @ApiResponse({ status: 404, description: 'Transfer not found' })
  @ApiResponse({ status: 409, description: 'Transfer cannot be processed (not in pending status)' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  process(@Param('id') id: string) {
    return this.transfersService.process(id);
  }

  @Post(':id/cancel')
  @ApiOperation({
    summary: 'Cancel a transfer',
    description: 'Cancel a pending transfer. Only transfers with "pending" status can be cancelled.'
  })
  @ApiParam({
    name: 'id',
    description: 'Unique transfer identifier',
    example: 'cm5tZ3N0MDAwMDAwMDAwMDAwMDAw'
  })
  @ApiResponse({
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
  })
  @ApiResponse({ status: 404, description: 'Transfer not found' })
  @ApiResponse({ status: 409, description: 'Transfer cannot be cancelled (not in pending status)' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid API key' })
  cancel(@Param('id') id: string) {
    return this.transfersService.cancel(id);
  }
}