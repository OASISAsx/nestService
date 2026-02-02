import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { paginationSchema } from 'src/common/schemas/pagination.schema';
import { getPagination } from 'src/common/helpers/pagination.helper';
import { ALL_USER_STATUS } from 'src/common/constants/statusDefault';
import { buildPaginationMeta } from 'src/common/helpers/pagination.helper';
import { ZodError } from 'zod';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async getUsers(input: unknown) {
    const parsed = paginationSchema.parse(input);

    const { page, limit, take, skip } = getPagination(parsed);
    try {
      const [data, total] = await Promise.all([
        this.prisma.users.findMany({
          where: {
            usersInformation: {
              isNot: null,
            },
          },
          include: {
            usersInformation: {
              include: {
                JobDetail: true,
              },
            },
          },
          take,
          skip,
        }),

        this.prisma.users.count({
          // where: {
          //   usersInformation: {
          //     isNot: null,
          //   },
        }),
      ]);

      const statusGroup = await this.prisma.usersInformation.groupBy({
        by: ['status'],
        _count: { status: true },
      });

      const statusSummary = ALL_USER_STATUS.reduce(
        (acc, status) => {
          acc[status] = 0;
          return acc;
        },
        {} as Record<string, number>,
      );

      statusGroup.forEach((item) => {
        statusSummary[item.status] = item._count.status;
      });

      return {
        data,
        meta: buildPaginationMeta(total, page, limit),
        // status: statusSummary,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException('Invalid pagination parameters');
      }
    }
  }

  async findOne(id: string) {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    const user = await this.prisma.users.findFirst({
      where: isObjectId ? { id } : { googleId: id },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
        usersInformation: {
          include: {
            bankInformation: true,
            JobDetail: true,
            province: true,
            district: true,
            subdistrict: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      ...user,
      roles: user.userRoles.map((ur) => ur.role.name),
    };
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id}${updateUserDto.name} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
