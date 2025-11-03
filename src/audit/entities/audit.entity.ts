export class AuditEntity {
  id: string;
  action: string;
  transferId?: string;
  details?: any;
  createdAt: Date;
}