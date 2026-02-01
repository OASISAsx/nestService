import {
  Controller,
  Get,
  // Post,
  Body,
  Patch,
  Param,
  Delete,
  // Post,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { DecryptGuard } from 'src/common/guards/decrypt.guard';
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
    const payload = req.decryptedBody ?? query;
    await this.usersService.getUsers(payload);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
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
