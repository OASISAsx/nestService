import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UploadService', () => {
  let service: UploadService;

  const mockCloudinaryService = {
    upload: jest.fn().mockResolvedValue({
      secure_url: 'https://test.com/image.jpg',
      public_id: 'test-id',
    }),
  };

  const mockPrismaService = {
    fileUpload: {
      create: jest.fn().mockResolvedValue({
        id: 1,
        url: 'https://test.com/image.jpg',
      }),
      createMany: jest.fn().mockResolvedValue({
        count: 1,
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
