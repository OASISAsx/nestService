import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ZodError } from 'zod';

@Injectable()
export class ThaiGeoService {
  constructor(private readonly prisma: PrismaService) {}

  async provices() {
    try {
      const data = await this.prisma.province.findMany({
        orderBy: { nameTh: 'asc' },
      });
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) throw new BadRequestException();
      return {
        success: false,
        message: 'Failed to fetch provices',
      };
    }
  }

  async districts(provinceCode: number) {
    try {
      const data = await this.prisma.district.findMany({
        where: { provinceCode },
        orderBy: { nameTh: 'asc' },
      });
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Error fetching districts:', error);
      return {
        success: false,
        message: 'Failed to fetch districts',
      };
    }
  }

  async subdistrict(districtCode: number) {
    try {
      const data = await this.prisma.subdistrict.findMany({
        where: { districtCode },
        orderBy: { nameTh: 'asc' },
      });
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Error fetching subdistricts:', error);
      return {
        success: false,
        message: 'Failed to fetch subdistricts',
      };
    }
  }
}
