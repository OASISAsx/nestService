import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ThaiGeoService {
  constructor(private readonly prisma: PrismaService) {}

  async provices() {
    const data = await this.prisma.province.findMany({
      orderBy: { nameTh: 'asc' },
    });
    return {
      success: true,
      data,
    };
  }

  async districts(provinceCode: number) {
    const data = await this.prisma.district.findMany({
      where: { provinceCode },
      orderBy: { nameTh: 'asc' },
    });
    return {
      success: true,
      data,
    };
  }
  async subdistrict(districtCode: number) {
    const data = await this.prisma.subdistrict.findMany({
      where: { districtCode },
      orderBy: { nameTh: 'asc' },
    });
    return {
      success: true,
      data,
    };
  }
}
