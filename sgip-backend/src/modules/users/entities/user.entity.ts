import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
    @ApiProperty({ example: 'cma12bc3d0000xyz' })
    id: string;

    @ApiProperty({ example: 'Josue López Herrera' })
    name: string;

    @ApiProperty({ example: 'josue.lopez' })
    username: string;

    @ApiProperty({ example: 'josue@sgip.mx' })
    email: string;

    @ApiProperty({ example: 'ADMIN', enum: ['ADMIN', 'PM', 'DEVELOPER', 'ANALYST', 'VIEWER'] })
    role: string;

    @ApiProperty({ example: true })
    active: boolean;

    @ApiProperty({ example: '2026-07-01T00:00:00.000Z' })
    createdAt: Date;

    @ApiProperty({ example: '2026-07-01T00:00:00.000Z', required: false })
    updatedAt?: Date;
}

export class AuthResponseEntity {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    access_token: string;
}

export class RegisterResponseEntity {
    @ApiProperty({ type: UserEntity })
    usuario: UserEntity;

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    access_token: string;
}