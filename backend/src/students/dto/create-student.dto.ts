import { IsDateString, IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(10, 15)
  phoneNumber: string;

  @IsString()
  course: string;

  @IsDateString()
  enrollmentDate: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
