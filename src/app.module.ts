import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransfersModule } from './transfers/transfers.module';
import { PrismaService } from './config/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TransfersModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
