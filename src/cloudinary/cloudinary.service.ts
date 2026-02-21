import { Inject, Injectable } from '@nestjs/common';
import { v2 as Cloudinary, UploadApiResponse } from 'cloudinary';
@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY')
    private cloudinary: typeof Cloudinary,
  ) {}
  async upload(buffer: Buffer): Promise<UploadApiResponse> {
    try {
      return await new Promise((resolve, reject) => {
        this.cloudinary.uploader
          .upload_stream({ folder: 'uploads' }, (err, result) => {
            if (err || !result) {
              return reject(
                err instanceof Error ? err : new Error('Upload failed'),
              );
            }
            resolve(result);
          })
          .end(buffer);
      });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Unknown upload error',
      );
    }
  }
}
