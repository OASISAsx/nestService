import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UploadService {
  constructor(
    private cloudinary: CloudinaryService,
    private prisma: PrismaService,
  ) {}

  async singleUpload(file: Express.Multer.File) {
    const result = await this.cloudinary.upload(file.buffer);

    return this.prisma.fileUpload.create({
      data: { url: result.secure_url },
    });
  }
}
