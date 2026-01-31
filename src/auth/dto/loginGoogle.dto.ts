import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginGoogleDto {
  googleId: string;
  name: string;
  image: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}
