import { Controller, Get, Param } from '@nestjs/common';
import { ThaiGeoService } from './thaigeo.service';

@Controller('thaiGeo')
export class ThaiGeoController {
  constructor(private readonly ThaiGeoService: ThaiGeoService) {}

  @Get('provinces')
  async getThaiGeoData() {
    return await this.ThaiGeoService.provices();
  }

  @Get('districts')
  async getDistricts(@Param('provinceCode') provinceCode: number) {
    return await this.ThaiGeoService.districts(provinceCode);
  }
  @Get('subdistricts')
  async subdistrict(@Param('districtCode') districtCode: number) {
    return await this.ThaiGeoService.subdistrict(districtCode);
  }
}
