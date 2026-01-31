import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { hashPassword } from 'src/utils/password.util';
import { LoginGoogleDto } from './dto/loginGoogle.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const { name, email, password } = dto;

    // check email exists
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
        status: 'active',
      },
    });

    // equivalent createUserLogin(newUser.id)
    // await this.prisma.userLogin.create({
    //   data: {
    //     user_id: newUser.id,
    //   },
    // });

    return newUser;
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.prisma.users.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
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

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await hashPassword(password, 10);

    if (!hashedPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = this.jwtService.sign({ id: user.id }, { expiresIn: '1h' });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    await this.prisma.sessions.upsert({
      where: { user_id: user.id },
      update: { jwt: token },
      create: { user_id: user.id, jwt: token },
    });

    return {
      token,
      user,
    };
  }
  async loginGoogle(dto: LoginGoogleDto) {
    const { googleId, email, name, image } = dto;

    let user = await this.prisma.users.findFirst({
      where: {
        OR: [{ googleId }, { email }],
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
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

    // 👉 ถ้าไม่เจอ user เลย → create ใหม่
    if (!user) {
      user = await this.prisma.users.create({
        data: {
          googleId,
          email,
          name,
          profileImage: image,
          status: 'active',
        },
        include: {
          userRoles: {
            include: { role: true },
          },
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
    }

    // 👉 ถ้าเจอ user แต่ยังไม่ผูก googleId → update
    else if (!user.googleId) {
      user = await this.prisma.users.update({
        where: { id: user.id },
        data: { googleId },
        include: {
          userRoles: {
            include: { role: true },
          },
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
    }

    const token = this.jwtService.sign({ id: user.id }, { expiresIn: '1h' });

    return {
      token,
      user,
    };
  }
}
