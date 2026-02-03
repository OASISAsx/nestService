import { BadRequestException, Injectable } from '@nestjs/common';
import {
  buildPaginationMeta,
  getPagination,
} from 'src/common/helpers/pagination.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { ZodError } from 'zod';
import { CreateUserInformationDto } from './dto/create.userInformation.dto';

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

  async create(dto: CreateUserInformationDto) {
    try {
      console.log(dto, 'dto');
      // TODO: add validation for the data to be sent in the body of the POST request
      // https://zod.dev/?id=
      return await this.prisma.usersInformation.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          citizenId: dto.citizenId,
          gender: dto.gender,
          nationality: dto.nationality,
          maritalStatus: dto.maritalStatus,
          id_card_image: dto.id_card_image,
          phone: dto.phone,
          email: dto.email,
          lineId: dto.lineId,
          facebook: dto.facebook,
          currentAddress: dto.currentAddress,
          provinceCode: dto.provinceCode,
          districtCode: dto.districtCode,
          subdistrictCode: dto.subdistrictCode,
          zipcode: dto.zipcode,
          dateOfBirth: dto.dateOfBirth,
          other_files: dto.other_files,
          status: dto.status,
        },
      });
    } catch (err) {
      if (err instanceof ZodError) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }
}
