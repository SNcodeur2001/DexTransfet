import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    // Run migrations on startup in production
    if (process.env.NODE_ENV === 'production') {
      await this.$executeRaw`SELECT 1`; // Test connection
      // Note: In production, migrations should be run during build or via external script
    }
  }

  async enableShutdownHooks(app: any) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}