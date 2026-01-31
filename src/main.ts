import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ลบ field ที่ไม่ได้อยู่ใน DTO
      forbidNonWhitelisted: true, // โยน error ถ้ามี field แปลก
      transform: true,
    }),
  );
  await app.listen(8080);
}
bootstrap();
