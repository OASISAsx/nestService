import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobDetailDto } from './dto/create-job-detail.dto';
import { UpdateJobDetailDto } from './dto/update-job-detail.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ZodError } from 'zod';

@Injectable()
export class JobDetailService {
  constructor(private prisma: PrismaService) {}
  async create(createJobDetailDto: CreateJobDetailDto) {
    try {
      const created = await this.prisma.jobDetail.create({
        data: createJobDetailDto, // ✅ ใช้ data
      });

      return {
        created,
        success: true,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException();
      }
    }
  }

  findAll() {
    return `This action returns all jobDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jobDetail`;
  }

  async update(id: string, updateJobDetailDto: UpdateJobDetailDto) {
    try {
      const update = await this.prisma.jobDetail.update({
        where: { id },
        data: updateJobDetailDto,
      });
      return {
        update,
        success: true,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException();
      }
    }
  }

  remove(id: number) {
    return `This action removes a #${id} jobDetail`;
  }
}
