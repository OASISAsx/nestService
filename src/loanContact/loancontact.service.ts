export const ALL_STATUSS = [
  'PENDING', // รอดำเนินการ
  'APPROVED', // อนุมัติ
  'ACTIVE', // กำลังผ่อน
  'COMPLETED', // ปิดสัญญา
  'REJECTED', // ปฏิเสธ];
];
import { BadRequestException, Injectable } from '@nestjs/common';

import {
  buildPaginationMeta,
  getPagination,
} from 'src/common/helpers/pagination.helper';
import { PaginationDto } from 'src/common/helpers/PaginationDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ZodError } from 'zod';

@Injectable()
export class LoanContactService {
  constructor(private readonly prisma: PrismaService) {}

  async getLoanContacts(input: PaginationDto) {
    const { page, limit, take, skip } = getPagination(input);

    try {
      const [data, total] = await Promise.all([
        this.prisma.loanContract.findMany({
          take,
          skip,
        }),
        this.prisma.loanContract.count(),
      ]);

      return {
        success: true,
        data: data,
        meta: buildPaginationMeta(total, page, limit),
      };
    } catch (error) {
      if (error instanceof ZodError) throw new BadRequestException();
    }
  }
  async getOne(id: string) {
    try {
      const data = await this.prisma.loanContract.findMany({
        where: { usersInformationId: id },
        include: { usersInformation: true },
      });
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      if (error instanceof ZodError) throw new BadRequestException();
    }
  }
  async getMainStatus(userInfoId: string) {
    const contracts = await this.prisma.loanContract.findMany({
      where: { usersInformationId: userInfoId },
      select: {
        status: true,
        loanAmount: true,
        installmentPerMonth: true,
      },
    });

    const totalContracts = contracts.length;

    const pendingAmount = contracts.filter(
      (c) => c.status === 'PENDING',
    ).length;

    const approvedAmount = contracts
      .filter((c) => c.status === 'APPROVED')
      .reduce((sum, c) => sum + c.loanAmount, 0);

    const usedAmount = contracts
      .filter((c) => c.status === 'ACTIVE')
      .reduce((sum, c) => sum + c.installmentPerMonth, 0);

    return {
      data: { totalContracts, pendingAmount, approvedAmount, usedAmount },
    };
  }

  // async statusLoan(userInfoId: string) {
  //   const statusCounts = await this.prisma.loanContract.groupBy({
  //     by: ['status'],
  //     where: { usersInformationId: userInfoId },
  //     _count: { status: true },
  //   });

  //   const result = ALL_STATUSS.map((status) => {
  //     const found = statusCounts.find((s) => s.status === status);
  //     const count = found ? found._count.status : 0;

  //     return `${status}: ${count}`;
  //   });

  //   return {
  //     success: true,
  //     data: result,
  //   };
  // }
}
