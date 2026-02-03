import { Module } from '@nestjs/common';
import { ThaiGeoController } from './thaigeo.controller';
import { ThaiGeoService } from './thaigeo.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [ThaiGeoController],
  providers: [ThaiGeoService, PrismaService],
})
export class ThaiGeoModule {}
