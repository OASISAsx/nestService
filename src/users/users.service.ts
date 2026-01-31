import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { paginationSchema } from 'src/schemas/pagination.schema';
import { getPagination } from 'src/helpers/paginationZod.helper';
import { ALL_USER_STATUS } from 'src/constants/statusDefault';
import { buildPaginationMeta } from 'src/helpers/pagination.helper';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async getUsers(input: unknown) {
    const parsed = paginationSchema.parse(input);

    const { page, limit, take, skip } = getPagination(parsed);

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
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id}${updateUserDto.name} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
