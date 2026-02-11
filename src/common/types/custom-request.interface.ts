import { Request } from 'express';
import { EncryptedRequestBody } from 'src/modules/guards/encrypted-request.interface';

export interface DecryptedPayload {
  page?: number;
  limit?: number;
  take?: number;
  skip?: number;
  [key: string]: unknown;
}

export interface CustomRequest extends Request<
  unknown,
  unknown,
  EncryptedRequestBody,
  EncryptedRequestBody
> {
  user?: {
    id: string;
    email?: string;
    apiSecret?: string; // 👈 เพิ่ม
  };
  auth?: {
    userId: string;
    roles: string[];
  };

  decryptedBody?: DecryptedPayload;
}
