import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  buildPaginationMeta,
  getPagination,
} from 'src/common/helpers/pagination.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { ZodError } from 'zod';
import { CreateUserInformationDto } from './dto/create.userInformation.dto';
import { UpdateUserInformationDto } from './dto/update.userInformation.dto';
import { Prisma } from '@prisma/client';
// import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/client';

@Injectable()
export class UserInformationService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(input: { page?: number; limit?: number }) {
    const { page, limit, take, skip } = getPagination(input);
    try {
      const [data, total] = await Promise.all([
        this.prisma.usersInformation.findMany({
          include: { bankInformation: true },
          take,
          skip,
        }),
        this.prisma.usersInformation.count(),
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
      throw error;
    }
  }

  // async create(dto: CreateUserInformationDto) {
  //   try {
  //     await this.prisma.usersInformation.create({
  //       data: {
  //         firstName: dto.firstName,
  //         lastName: dto.lastName,
  //         citizenId: dto.citizenId,
  //         gender: dto.gender,
  //         nationality: dto.nationality,
  //         maritalStatus: dto.maritalStatus,
  //         id_card_image: dto.id_card_image,
  //         phone: dto.phone,
  //         email: dto.email,
  //         lineId: dto.lineId,
  //         facebook: dto.facebook,
  //         currentAddress: dto.currentAddress,
  //         provinceCode: dto.provinceCode,
  //         districtCode: dto.districtCode,
  //         subdistrictCode: dto.subdistrictCode,
  //         zipcode: dto.zipcode,
  //         dateOfBirth: dto.dateOfBirth,
  //         other_files: dto.other_files,
  //         status: dto.status,
  //       },
  //     });
  //   } catch (err) {
  //     if (err instanceof ZodError) {
  //       throw new BadRequestException(err.message);
  //     }
  //     throw err;
  //   }
  // }
  async findOne(id: string) {
    try {
      // 1️⃣  Find the user by PK (must exist or return null)
      const user = await this.prisma.users.findUnique({
        where: { id },
      });

      if (!user) {
        /* 404 – no such user */
        throw new NotFoundException(`User with id ${id} not found`);
      }

      // 2️⃣  Find the related usersInformation record
      //      (relational FK name = usersInformationId)
      const data = await this.prisma.usersInformation.findUnique({
        where: { id: user.usersInformationId || undefined },
      });

      /* 3️⃣  Return a clean success object */
      return {
        success: true,
        data,
      };
    } catch (err) {
      /* 4️⃣  Split Zod validation errors from other ones */
      if (err instanceof ZodError) {
        throw new BadRequestException(err.message);
      }
      throw err; // re‑throw Prisma or other unexpected errors
    }
  }

  async createUserInformationAndLinkToUser(
    userInformationDto: CreateUserInformationDto,
    userId: string,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      try {
        // สร้าง base data
        const createData = {
          firstName: userInformationDto.firstName,
          lastName: userInformationDto.lastName,
          citizenId: userInformationDto.citizenId,
          gender: userInformationDto.gender ?? null,
          nationality: userInformationDto.nationality ?? null,
          maritalStatus: userInformationDto.maritalStatus ?? null,
          id_card_image: userInformationDto.id_card_image,
          phone: userInformationDto.phone,
          email: userInformationDto.email ?? null,
          lineId: userInformationDto.lineId ?? null,
          facebook: userInformationDto.facebook ?? null,
          currentAddress: userInformationDto.currentAddress ?? null,
          zipcode: userInformationDto.zipcode ?? null,
          dateOfBirth: userInformationDto.dateOfBirth,
          other_files: userInformationDto.other_files ?? [],
          status: userInformationDto.status,
          // เพิ่ม relation connects
          province: userInformationDto.provinceCode
            ? {
                connect: { code: userInformationDto.provinceCode },
              }
            : undefined,
          district: userInformationDto.districtCode
            ? {
                connect: { code: userInformationDto.districtCode },
              }
            : undefined,
          subdistrict: userInformationDto.subdistrictCode
            ? {
                connect: { code: userInformationDto.subdistrictCode },
              }
            : undefined,
        };

        // 1. Create UserInformation
        const userInformation = await tx.usersInformation.create({
          data: createData,
        });
        await tx.users.update({
          where: { id: userId },
          data: {
            usersInformationId: userInformation.id,
          },
        });

        return userInformation;
      } catch (err) {
        if (err instanceof ZodError) {
          throw new BadRequestException(err.message);
        }
        throw err;
      }
    });
  }

  async updateUserInformation(id: string, payload: UpdateUserInformationDto) {
    const { provinceCode, districtCode, subdistrictCode, ...rest } = payload;

    const data: Prisma.UsersInformationUpdateInput = { ...rest };

    /* ---------- relation handling -------------- */
    if (provinceCode !== undefined) {
      data.province = provinceCode
        ? { connect: { code: provinceCode } }
        : { disconnect: true };
    }
    if (districtCode !== undefined) {
      data.district = districtCode
        ? { connect: { code: districtCode } }
        : { disconnect: true };
    }
    if (subdistrictCode !== undefined) {
      data.subdistrict = subdistrictCode
        ? { connect: { code: subdistrictCode } }
        : { disconnect: true };
    }

    try {
      const result = await this.prisma.usersInformation.update({
        where: { id },
        data,
        include: {
          province: true,
          district: true,
          subdistrict: true,
          bankInformation: true,
        },
      });
      return {
        success: true,
        result,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException(err);
    }
  }
}
