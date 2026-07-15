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
  @IsString({ message: 'El nombre debe ser un texto válido' })
  name: string;

  @IsString({ message: 'El nombre de usuario debe ser un texto válido' })
  username: string;

  @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido' })
  email: string;

  @IsString({ message: 'La contraseña debe ser un texto válido' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsOptional()
  @IsEnum(Role, {
    message: `El rol debe ser uno de los siguientes: ${Object.values(Role).join(', ')}`,
  })
  role?: Role;
}
