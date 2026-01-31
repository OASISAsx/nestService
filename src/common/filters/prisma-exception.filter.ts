import {
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError) {
    let message = 'เกิดข้อผิดพลาดจากฐานข้อมูล';
    let status = HttpStatus.BAD_REQUEST;

    switch (exception.code) {
      case 'P2002':
        message = 'ข้อมูลซ้ำในระบบ';
        status = HttpStatus.BAD_REQUEST;
        break;

      case 'P2025':
        message = 'ไม่พบข้อมูล';
        status = HttpStatus.NOT_FOUND;
        break;

      case 'P2003':
        message = 'ข้อมูลอ้างอิงไม่ถูกต้อง';
        status = HttpStatus.BAD_REQUEST;
        break;

      default:
        message = exception.message;
        status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    throw new HttpException(message, status);
  }
}
