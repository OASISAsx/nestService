import {
  // BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// import { paginationSchema } from 'src/common/schemas/pagination.schema';
import { PaginationDto } from 'src/common/helpers/PaginationDto';
import {
  buildPaginationMetaDecrypt,
  getPaginationDecrypt,
} from 'src/common/helpers/paginationDecrypt.helper';
import { StatusUser } from '@prisma/client';
// import { ALL_USER_STATUS } from 'src/common/constants/statusDefault';
// import { ZodError } from 'zod';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async getUsers(input: PaginationDto) {
    const { take, skip, page, limit } = getPaginationDecrypt(input);

    const where = {
      usersInformation: { isNot: null },
    };

    const [data, total, statusCounts] = await Promise.all([
      this.prisma.users.findMany({
        where,
        include: {
          usersInformation: {
            include: { JobDetail: true },
          },
        },
        take,
        skip,
      }),

      this.prisma.users.count({ where }),

      this.prisma.users.groupBy({
        by: ['status'],
        where,
        _count: {
          status: true,
        },
      }),
    ]);
    const statusSummary = Object.values(StatusUser).map((status) => {
      const found = statusCounts.find((s) => s.status === status);
      return {
        status,
        count: found?._count.status ?? 0,
      };
    });

    return {
      data,
      meta: buildPaginationMetaDecrypt(total, page, limit),
      status: statusSummary,
    };
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
