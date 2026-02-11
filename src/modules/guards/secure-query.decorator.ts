import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CustomRequest } from 'src/common/types/custom-request.interface';

export const SecureQuery = createParamDecorator(
  <T = unknown>(data: unknown, ctx: ExecutionContext): T => {
    const req = ctx.switchToHttp().getRequest<CustomRequest>();

    const value = req.decryptedBody ?? req.query;

    return value as T;
  },
);
