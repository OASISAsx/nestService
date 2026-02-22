import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateJobDetailDto {
  occupation: string;
  @IsString()
  companyName: string;
  @IsString()
  companyAddress: string;
  @IsString()
  position: string;
  @IsNumber()
  salaryPerMonth: number;
  @IsNumber()
  otherIncome: number;
  @Type(() => Number)
  @IsNumber()
  workYears: number;
  @IsString()
  employmentType: string;
  @IsString()
  @IsOptional()
  salarySlip: string[];
  @IsString()
  startDate: string;
  @IsString()
  usersInformationId: string;
}
