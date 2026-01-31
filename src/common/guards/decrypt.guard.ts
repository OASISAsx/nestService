import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {
  CustomRequest,
  DecryptedPayload,
} from '../types/custom-request.interface';

@Injectable()
export class DecryptGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<CustomRequest>();

    const encrypted: unknown =
      Object.keys(request.body ?? {}).length > 0 ? request.body : request.query;

    // 🔐 decrypt จริงของคุณตรงนี้
    const decrypted: DecryptedPayload = this.decrypt(encrypted);

    request.decryptedBody = decrypted;

    return true;
  }

  private decrypt(payload: unknown): DecryptedPayload {
    // ตัวอย่าง mock
    if (typeof payload === 'object' && payload !== null) {
      return payload as DecryptedPayload;
    }

    return {};
  }
}
