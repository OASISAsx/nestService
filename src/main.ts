import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Global error handler
  app.useGlobalFilters(new PrismaExceptionFilter());

  // ✅ CORS (prod friendly)
  app.enableCors({
    origin: true, // หรือใส่ domain frontend จริงใน prod
    credentials: true,
  });

  // ✅ Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // ✅ ใช้ env port (fallback 3001)
  const PORT = process.env.PORT || 3001;

  // ⭐ สำคัญมากสำหรับ Docker/VPS
  await app.listen(PORT, '0.0.0.0');

  console.log(`🚀 Backend running on port ${PORT}`);
}

bootstrap();
