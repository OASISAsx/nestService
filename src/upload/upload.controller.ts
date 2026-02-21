import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    console.log('FILE =>', file);
    return this.uploadService.singleUpload(file);
  }
}
