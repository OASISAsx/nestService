import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import {
  CustomRequest,
  DecryptedPayload,
} from '../../common/types/custom-request.interface';
import * as CryptoJS from 'crypto-js';

// interface EncryptedRequest {
//   payload: string;
// }
@Injectable()
export class DecryptGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<CustomRequest>();

    const source: unknown =
      Object.keys(request.body ?? {}).length > 0 ? request.body : request.query;

    if (!this.isEncryptedRequest(source)) {
      request.decryptedBody = source as DecryptedPayload;
      return true;
    }

    const secret = request.user?.apiSecret; // 🔥 ใช้ dynamic secret

    if (!secret) {
      throw new BadRequestException('Missing apiSecret for decryption');
    }

    const bytes = CryptoJS.AES.decrypt(source.payload, secret);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedText) {
      throw new BadRequestException('Decrypt failed (wrong role secret)');
    }

    request.decryptedBody = JSON.parse(decryptedText) as DecryptedPayload;

    return true;
  }

  private isEncryptedRequest(value: unknown): value is { payload: string } {
    return typeof value === 'object' && value !== null && 'payload' in value;
  }
}
