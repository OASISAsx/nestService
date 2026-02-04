import { Controller, Get, Query } from '@nestjs/common';
import { ThaiGeoService } from './thaigeo.service';

@Controller('thaiGeo')
export class ThaiGeoController {
  constructor(private readonly ThaiGeoService: ThaiGeoService) {}

  @Get('provinces')
  async getThaiGeoData() {
    return await this.ThaiGeoService.provices();
  }

  @Get('districts')
  async getDistricts(@Query('provinceCode') provinceCode: number) {
    return await this.ThaiGeoService.districts(provinceCode);
  }
  @Get('subdistricts')
  async subdistrict(@Query('districtCode') districtCode: number) {
    return await this.ThaiGeoService.subdistrict(districtCode);
  }
}
