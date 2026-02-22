import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { comparePassword, hashPassword } from 'src/modules/utils/password.util';
import { LoginGoogleDto } from './dto/loginGoogle.dto';
import { ZodError } from 'zod';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const { name, email, password } = dto;

    const existingUser = await this.prisma.users.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await hashPassword(password, 10);

    const newUser = await this.prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        status: 'PENDING',
      },
    });

    await this.createUserRole(newUser.id);

    return {
      success: true,
      data: newUser,
    };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;
    console.log(email, 'dev1@dev.com');
    const user = await this.prisma.users.findFirst({
      where: { email },
      include: {
        userRoles: { include: { role: true } },
        usersInformation: {
          include: {
            JobDetail: true,
            province: true,
            district: true,
            subdistrict: true,
          },
        },
      },
    });
    console.log(user, 'user');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.password) {
      throw new UnauthorizedException('This account uses Google login');
    }
    const isValid = await comparePassword(password, user.password);
    console.log(isValid, 'isValid');
    if (!isValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = this.jwtService.sign(
      {
        id: user.id,
        roles: user.userRoles.map((r) => r.role.name),
      },
      { expiresIn: '1h' },
    );

    await this.prisma.sessions.upsert({
      where: { user_id: user.id },
      update: { jwt: token },
      create: { user_id: user.id, jwt: token },
    });

    return {
      success: true,
      token,
      user,
    };
  }

  async loginGoogle(dto: LoginGoogleDto) {
    const { googleId, email, name, image } = dto;

    const userInclude = {
      userRoles: { include: { role: true } },
      usersInformation: {
        include: {
          JobDetail: true,
          province: true,
          district: true,
          subdistrict: true,
        },
      },
    };

    try {
      let user = await this.prisma.users.findFirst({
        where: { googleId },
        include: userInclude,
      });

      if (!user && email) {
        user = await this.prisma.users.findFirst({
          where: { email },
          include: userInclude,
        });
      }

      // 3. ถ้าไม่เจอเลย → create
      if (!user) {
        user = await this.prisma.users.create({
          data: {
            googleId,
            email,
            name,
            profileImage: image,
            status: 'PENDING',
          },
          include: userInclude,
        });
        await this.createUserRole(user.id);
      }
      // 4. ถ้าเจอแต่ยังไม่ผูก googleId
      else if (!user.googleId) {
        user = await this.prisma.users.update({
          where: { id: user.id },
          data: { googleId },
          include: userInclude,
        });
      }

      const token = this.jwtService.sign(
        {
          id: user.id,
          roles: user.userRoles.map((r) => r.role.name),
        },
        { expiresIn: '1h' },
      );

      return {
        success: true,
        token,
        user,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException('Cannot login with Google');
      }

      throw error;
    }
  }

  async createUserRole(userId: string) {
    const findRole = await this.prisma.role.findFirst({
      where: { name: 'USER' },
    });

    if (!findRole) {
      throw new NotFoundException('USER role not found');
    }

    return this.prisma.userRole.create({
      data: { userId, roleId: findRole.id },
    });
  }
}
