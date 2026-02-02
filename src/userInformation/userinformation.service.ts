import { BadRequestException, Injectable } from '@nestjs/common';
import {
  buildPaginationMeta,
  getPagination,
} from 'src/common/helpers/pagination.helper';
// import { paginationSchema } from 'src/common/schemas/pagination.schema';
import { PrismaService } from 'src/prisma/prisma.service';
import { ZodError } from 'zod';

@Injectable()
export class UserInformationService {
  constructor(private readonly prisma: PrismaService) {}
  async getAll(input: { page?: number; limit?: number }) {
    const { page, limit, take, skip } = getPagination(input);
    try {
      const [data, total] = await Promise.all([
        this.prisma.usersInformation.findMany({
          include: {
            bankInformation: true,
          },
          take,
          skip,
        }),
        this.prisma.usersInformation.count({
          // where: {
          //   usersInformation: {
          //     isNot: null,
          //   },
        }),
      ]);
      return {
        success: true,
        data,
        meta: buildPaginationMeta(total, page, limit),
      };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException();
      }
    }
  }
}
