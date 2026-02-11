import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: { id: string }) {
    /**
     * payload = ตอนที่คุณ sign ใน AuthService.login()
     */
    const user = await this.prisma.users.findUnique({
      where: { id: payload.id },
      include: {
        userRoles: {
          include: {
            role: true, // ต้องเอา apiSecret จาก role
          },
        },
      },
    });

    if (!user) throw new UnauthorizedException();

    /**
     * เลือก role ที่ต้องใช้เข้ารหัส (เช่น ADMIN)
     */
    const role = user.userRoles.find((r) => r.role.name === 'ADMIN');

    if (!role) throw new UnauthorizedException('Role not allowed');

    /**
     * return object นี้ → จะถูก inject เป็น request.user
     */
    return {
      id: user.id,
      email: user.email,
      roles: user.userRoles.map((r) => r.role.name),
      apiSecret: role.role.apiSecret, // 🔐 เอาไปใช้ decrypt
    };
  }
}
