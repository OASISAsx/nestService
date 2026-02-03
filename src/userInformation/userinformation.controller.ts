/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, Query } from '@nestjs/common';
// import * as customRequestInterface from 'src/common/types/custom-request.interface';
import { UserInformationService } from './userinformation.service';
import { CreateUserInformationDto } from './dto/create.userInformation.dto';
// import { CreateUserInformationDto } from './dto/create.userInformation.dto';
@Controller('information')
export class UserInformationController {
  constructor(
    private readonly UserInformationService: UserInformationService,
  ) {}
  @Get()
  async getAll(@Query() query: Record<string, unknown>) {
    return await this.UserInformationService.getAll(query);
  }
  @Post()
  async create(@Body() data: CreateUserInformationDto) {
    return await this.UserInformationService.create(data);
  }
}
