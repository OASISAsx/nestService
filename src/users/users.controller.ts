import {
  Controller,
  Get,
  // Post,
  Body,
  Param,
  // Post,
  UseGuards,
  ValidationPipe,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { DecryptGuard } from 'src/modules/guards/decrypt.guard';
// import * as customRequestInterface from 'src/common/types/custom-request.interface';
import { SecureQuery } from 'src/modules/guards/secure-query.decorator';
import { PaginationDto } from 'src/common/helpers/PaginationDto';
import { JwtAuthGuard } from 'src/modules/guards/jwt-auth.guard';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('usersAll')
  @UseGuards(JwtAuthGuard, DecryptGuard)
  async getUsers(
    @SecureQuery<PaginationDto>(new ValidationPipe({ transform: true }))
    query: PaginationDto,
  ) {
    return this.usersService.getUsers(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
