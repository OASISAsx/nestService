// create-user-information.dto.ts
import {
  IsString,
  IsOptional,
  IsEmail,
  IsArray,
  IsEnum,
  IsDate,
  IsNumber,
} from 'class-validator';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';

export enum Status {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class CreateUserInformationDto
  implements Prisma.UsersInformationCreateInput
{
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  citizenId: string;

  @IsString()
  @IsOptional()
  gender?: string | null;

  @IsString()
  @IsOptional()
  nationality?: string | null;

  @IsString()
  @IsOptional()
  maritalStatus?: string | null;

  @IsString()
  id_card_image: string;

  @IsString()
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string | null;

  @IsString()
  @IsOptional()
  lineId?: string | null;

  @IsString()
  @IsOptional()
  facebook?: string | null;

  @IsString()
  @IsOptional()
  currentAddress?: string | null;

  @IsNumber()
  provinceCode?: number;

  @IsNumber()
  districtCode?: number | null;

  @IsNumber()
  subdistrictCode?: number | null;

  @IsString()
  @IsOptional()
  zipcode?: string | null;

  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @IsArray()
  @IsOptional()
  other_files?: string[];
  @IsString()
  userId: string;
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}

// update-user-information-id.dto.ts
export class UpdateUserInformationIdDto {
  @IsString()
  userId: string;

  @IsString()
  usersInformationId: string;
}
