/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
// import * as customRequestInterface from 'src/common/types/custom-request.interface';
import { UserInformationService } from './userinformation.service';
import { CreateUserInformationDto } from './dto/create.userInformation.dto';
import { UpdateUserInformationDto } from './dto/update.userInformation.dto';
import { PaginationDto } from 'src/common/helpers/PaginationDto';
import { SecureQuery } from 'src/modules/guards/secure-query.decorator';
// import { CreateUserInformationDto } from './dto/create.userInformation.dto';
@Controller('information')
export class UserInformationController {
  constructor(
    private readonly UserInformationService: UserInformationService,
  ) {}
  @Get()
  async getAll(
    @SecureQuery<PaginationDto>(new ValidationPipe({ transform: true }))
    query: PaginationDto,
  ) {
    return await this.UserInformationService.getAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.UserInformationService.findOne(id); // TODO: add validation for the wa
  }

  @Post()
  async create(@Body() data: CreateUserInformationDto) {
    return await this.UserInformationService.createUserInformationAndLinkToUser(
      data,
      data.userId,
    );
  }
  @Put('/:id')
  async update(
    @Body() data: UpdateUserInformationDto,
    @Param('id') id: string,
  ) {
    return await this.UserInformationService.updateUserInformation(id, data);
  }
}
