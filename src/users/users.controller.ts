import {
  Controller,
  Get,
  // Post,
  Body,
  Patch,
  Param,
  Delete,
  // Post,
  BadRequestException,
  Req,
  Query,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { DecryptGuard } from 'src/common/guards/decrypt.guard';
import { ZodError } from 'zod';
import * as customRequestInterface from 'src/common/types/custom-request.interface';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(DecryptGuard) // ✅ ใช้ guard
  async getUsers(
    @Req() req: customRequestInterface.CustomRequest,
    @Query() query: Record<string, unknown>,
  ) {
    try {
      const payload = req.decryptedBody ?? query;

      const result = await this.usersService.getUsers(payload);

      return {
        success: true,
        ...result,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException('Invalid pagination parameters');
      }

      console.error('getUsers error:', error);
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
