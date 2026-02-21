import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // 🔹 upload ไฟล์เดียว
  @Post('single')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  uploadSingle(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.singleUpload(file);
  }

  // 🔹 upload หลายไฟล์
  @Post('multiple')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(),
    }),
  )
  uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    return this.uploadService.multiUpload(files);
  }
}
