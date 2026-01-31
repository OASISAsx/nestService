import { Request } from 'express';

export interface DecryptedPayload {
  page?: number;
  limit?: number;
  take?: number;
  skip?: number;
  [key: string]: unknown;
}

export interface CustomRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };

  auth?: {
    userId: string;
    roles: string[];
  };

  roleSecret?: string;
  aesKey?: string;

  decryptedBody?: DecryptedPayload;
}
