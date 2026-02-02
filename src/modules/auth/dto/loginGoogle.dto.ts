import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class LoginGoogleDto {
  @IsNotEmpty()
  googleId: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  image?: string;

  @IsEmail()
  email: string;
}
