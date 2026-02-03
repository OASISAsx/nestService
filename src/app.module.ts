import { ThaiGeoModule } from './thaiGeo/thaigeo.module';
import { UserInfornationModule } from './userInformation/userinfornation.module';
import { UserInformationService } from './userInformation/userinformation.service';
import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
// import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ThaiGeoModule,
    UserInfornationModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    ThaiGeoModule,
  ],
  controllers: [],
  providers: [UserInformationService],
})
export class AppModule {}
