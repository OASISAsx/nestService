// src/users/dto/update-user-information.dto.ts
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDate,
  IsEmail,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
export enum Status {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class UpdateUserInformationDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsOptional()
  @IsString()
  firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsString() citizenId?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateOfBirth?: Date;

  @IsOptional() @IsString() gender?: string;
  @IsOptional() @IsString() nationality?: string;
  @IsOptional() @IsString() maritalStatus?: string;
  @IsOptional() @IsString() id_card_image?: string;
  @IsOptional() @IsString() phone?: string; // unique
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() lineId?: string;
  @IsOptional() @IsString() facebook?: string;
  @IsOptional() @IsString() currentAddress?: string;
  @IsOptional() @IsString() zipcode?: string;
  @IsOptional() @IsArray() other_files?: string[];

  @IsOptional() @IsNumber() provinceCode?: number;
  @IsOptional() @IsNumber() districtCode?: number;
  @IsOptional() @IsNumber() subdistrictCode?: number;

  //   @IsOptional() @IsString() status?: Status;
  //   @IsOptional() @IsString() province?: string;
  //   @IsOptional() @IsString() district?: string;
  //   @IsOptional() @IsString() subdistrict?: string;
}
