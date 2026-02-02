/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { UserInformationService } from './userinformation.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInformationController } from './userinformation.controller';

@Module({
  imports: [],
  controllers: [UserInformationController],
  providers: [PrismaService, UserInformationService],
})
export class UserInfornationModule {}
