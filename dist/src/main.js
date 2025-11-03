"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('DEXCHANGE API')
        .setDescription('API for managing money transfers')
        .setVersion('1.0')
        .addTag('transfers')
        .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'api-key')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    app.getHttpAdapter().get('/health', (req, res) => {
        res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    if (process.env.NODE_ENV === 'production') {
        console.log('🔄 Running database migrations...');
        const { execSync } = require('child_process');
        try {
            execSync('npx prisma migrate deploy', { stdio: 'inherit' });
            console.log('✅ Database migrations completed successfully');
        }
        catch (error) {
            console.error('❌ Database migration failed:', error.message);
        }
    }
    await app.listen(process.env.PORT ?? 3000);
    console.log(`🚀 DEXCHANGE API running on: http://localhost:${process.env.PORT ?? 3000}`);
    console.log(`📚 Swagger docs available at: http://localhost:${process.env.PORT ?? 3000}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map