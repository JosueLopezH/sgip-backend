import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'josue.lopez', description: 'Nombre de usuario' })
    @IsString()
    username: string;

    @ApiProperty({ example: 'Admin123', description: 'Contraseña del usuario' })
    @IsString()
    password: string;
}