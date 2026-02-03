import {
  IsString,
  IsNumber,
  IsPhoneNumber,
  IsEmail,
  IsOptional,
  IsEnum,
} from 'class-validator';

// นำเข้า Status enum จาก Prisma
import { Status } from '@prisma/client';

export class CreateUserInformationDto {
  @IsString() firstName!: string;
  @IsString() lastName!: string;
  @IsString() citizenId!: string;

  // dateOfBirth ควรเป็น string ที่แปลงเป็น Date ภายหลัง
  @IsString() dateOfBirth!: string;

  @IsOptional() @IsString() gender?: string | null;
  @IsOptional() @IsString() nationality?: string | null;
  @IsOptional() @IsString() maritalStatus?: string | null;

  @IsString() id_card_image!: string;
  @IsPhoneNumber('TH') phone!: string;

  @IsOptional() @IsEmail() email?: string | null;
  @IsOptional() @IsString() lineId?: string | null;
  @IsOptional() @IsString() facebook?: string | null;
  @IsOptional() @IsString() currentAddress?: string | null;

  @IsOptional() @IsNumber() provinceCode?: number | null;
  @IsOptional() @IsNumber() districtCode?: number | null;
  @IsOptional() @IsNumber() subdistrictCode?: number | null;
  @IsOptional() @IsString() zipcode?: string | null;

  // 🔥 แก้ไขตรงนี้ - ใช้ IsEnum และรับค่าเป็น Status
  @IsEnum(Status) status!: Status;

  @IsString({ each: true }) other_files!: string[];

  @IsOptional() @IsString() userId?: string;
}
