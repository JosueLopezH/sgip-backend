import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum Role {
  ADMIN = 'ADMIN',
  PM = 'PM',
  DEVELOPER = 'DEVELOPER',
  ANALYST = 'ANALYST',
  VIEWER = 'VIEWER',
}

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
