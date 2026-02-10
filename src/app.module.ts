import { ThaiGeoModule } from './thaiGeo/thaigeo.module';
import { UserInfornationModule } from './userInformation/userinfornation.module';
import { UserInformationService } from './userInformation/userinformation.service';
import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { LoanContactModule } from './loanContact/loancontact.module';

// import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
    }),

    PrismaModule,
    UsersModule,
    AuthModule,
    ThaiGeoModule,
    UserInfornationModule,
    LoanContactModule,
  ],
  controllers: [AppController],
  providers: [UserInformationService],
})
export class AppModule {}
