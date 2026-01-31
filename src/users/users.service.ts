import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const user = await this.prisma.users.create({
      data: dto,
    });

    return {
      success: true,
      message: 'สร้างผู้ใช้สำเร็จ',
      data: user,
    };
  }

  async findAll() {
    const users = await this.prisma.users.findMany({});
    return {
      success: true,
      data: users,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id}${updateUserDto.name} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
