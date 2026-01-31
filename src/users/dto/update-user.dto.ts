// import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto {
  id: string;
  name: string;
  email: string;
  password: string;
}
