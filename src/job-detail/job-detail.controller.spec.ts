import { Test, TestingModule } from '@nestjs/testing';
import { JobDetailController } from './job-detail.controller';
import { JobDetailService } from './job-detail.service';

describe('JobDetailController', () => {
  let controller: JobDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobDetailController],
      providers: [JobDetailService],
    }).compile();

    controller = module.get<JobDetailController>(JobDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
