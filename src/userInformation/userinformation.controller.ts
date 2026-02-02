/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Query } from '@nestjs/common';
// import * as customRequestInterface from 'src/common/types/custom-request.interface';
import { UserInformationService } from './userinformation.service';
@Controller('userInformation')
export class UserInformationController {
  constructor(
    private readonly UserInformationService: UserInformationService,
  ) {}
  @Get()
  async getAll(@Query() query: Record<string, unknown>) {
    return await this.UserInformationService.getAll(query);
  }
}
