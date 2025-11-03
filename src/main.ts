import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipes
  app.useGlobalPipes(new ValidationPipe());

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('DEXCHANGE API')
    .setDescription('API for managing money transfers')
    .setVersion('1.0')
    .addTag('transfers')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'api-key')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Health check endpoint
  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Run database migrations on startup in production
  if (process.env.NODE_ENV === 'production') {
    console.log('🔄 Running database migrations...');
    const { execSync } = require('child_process');
    try {
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('✅ Database migrations completed successfully');
    } catch (error) {
      console.error('❌ Database migration failed:', error.message);
      // Don't exit the process, let the app start anyway
    }
  }

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 DEXCHANGE API running on: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`📚 Swagger docs available at: http://localhost:${process.env.PORT ?? 3000}/docs`);
}
bootstrap();
