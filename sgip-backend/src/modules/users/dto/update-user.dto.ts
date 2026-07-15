import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from './create-user.dto';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto válido' })
  name?: string;

  @IsOptional()
  @IsEnum(Role, {
    message: `El rol debe ser uno de los siguientes: ${Object.values(Role).join(', ')}`,
  })
  role?: Role;

  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser verdadero o falso' })
  active?: boolean;
}
