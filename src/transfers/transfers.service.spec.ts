import { Test, TestingModule } from '@nestjs/testing';
import { TransfersService } from './transfers.service';
import { TransfersRepository } from './transfers.repository';
import { ProviderSimulator } from './provider.simulator';
import { AuditService } from '../audit/audit.service';

describe('TransfersService', () => {
  let service: TransfersService;
  let repository: TransfersRepository;
  let providerSimulator: ProviderSimulator;
  let auditService: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransfersService,
        {
          provide: TransfersRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            updateStatus: jest.fn(),
          },
        },
        {
          provide: ProviderSimulator,
          useValue: {
            processTransfer: jest.fn(),
          },
        },
        {
          provide: AuditService,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransfersService>(TransfersService);
    repository = module.get<TransfersRepository>(TransfersRepository);
    providerSimulator = module.get<ProviderSimulator>(ProviderSimulator);
    auditService = module.get<AuditService>(AuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateFees', () => {
    it('should calculate fees correctly (0.8% rounded up)', () => {
      const calculateFees = (service as any).calculateFees.bind(service);

      expect(calculateFees(10000)).toBe(80); // 10000 * 0.008 = 80
      expect(calculateFees(12500)).toBe(100); // 12500 * 0.008 = 100
      expect(calculateFees(1000)).toBe(100); // min 100
      expect(calculateFees(200000)).toBe(1500); // max 1500
    });
  });

  describe('process', () => {
    it('should process a transfer successfully', async () => {
      const mockTransfer = {
        id: '1',
        status: 'PENDING',
        reference: 'TRF-123',
        amount: 1000,
        fees: 8,
        total: 1008,
        currency: 'XOF',
        channel: 'WAVE',
        recipient: { phone: '123', name: 'Test' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockResult = { success: true, providerRef: 'PROV-123' };

      jest.spyOn(repository, 'findById').mockResolvedValue(mockTransfer);
      jest.spyOn(repository, 'updateStatus').mockResolvedValue({ ...mockTransfer, status: 'SUCCESS' });
      jest.spyOn(providerSimulator, 'processTransfer').mockResolvedValue(mockResult);

      const result = await service.process('1');

      expect(repository.updateStatus).toHaveBeenCalledWith('1', 'PROCESSING');
      expect(repository.updateStatus).toHaveBeenCalledWith('1', 'SUCCESS', 'PROV-123');
      expect(auditService.log).toHaveBeenCalledWith('TRANSFER_PROCESSING', '1');
      expect(auditService.log).toHaveBeenCalledWith('TRANSFER_SUCCESS', '1', { providerRef: 'PROV-123' });
    });

    it('should handle failed transfer', async () => {
      const mockTransfer = {
        id: '1',
        status: 'PENDING',
        reference: 'TRF-123',
        amount: 1000,
        fees: 8,
        total: 1008,
        currency: 'XOF',
        channel: 'WAVE',
        recipient: { phone: '123', name: 'Test' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockResult = { success: false, errorCode: 'INSUFFICIENT_FUNDS' };

      jest.spyOn(repository, 'findById').mockResolvedValue(mockTransfer);
      jest.spyOn(repository, 'updateStatus').mockResolvedValue({ ...mockTransfer, status: 'FAILED' });
      jest.spyOn(providerSimulator, 'processTransfer').mockResolvedValue(mockResult);

      const result = await service.process('1');

      expect(repository.updateStatus).toHaveBeenCalledWith('1', 'FAILED', undefined, 'INSUFFICIENT_FUNDS');
      expect(auditService.log).toHaveBeenCalledWith('TRANSFER_FAILED', '1', { errorCode: 'INSUFFICIENT_FUNDS' });
    });
  });
});