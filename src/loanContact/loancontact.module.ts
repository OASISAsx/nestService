/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { LoanContactController } from './loancontact.controller';
import { LoanContactService } from './loancontact.service';

@Module({
  imports: [],
  controllers: [LoanContactController],
  providers: [LoanContactService, PrismaService],
})
export class LoanContactModule {}
