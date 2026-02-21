import { Injectable, BadRequestException } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UploadService {
  constructor(
    private cloudinary: CloudinaryService,
    private prisma: PrismaService,
  ) {}

  async singleUpload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File not provided');
    }

    const result = await this.cloudinary.upload(file.buffer);

    return this.prisma.fileUpload.create({
      data: { url: result.secure_url },
    });
  }

  async multiUpload(files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Files not provided');
    }

    const uploadResults = await Promise.all(
      files.map((file) => this.cloudinary.upload(file.buffer)),
    );

    // เตรียมข้อมูลสำหรับ insert หลาย record
    const data = uploadResults.map((result) => ({
      url: result.secure_url,
    }));

    // ใช้ createMany เร็วกว่า loop create ทีละตัว
    await this.prisma.fileUpload.createMany({
      data,
    });

    return {
      message: 'Upload success',
      count: data.length,
      files: data,
    };
  }
}
