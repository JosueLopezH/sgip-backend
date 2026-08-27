import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTaskDto {
    @ApiProperty({ example: 'Implementar módulo de autenticación' })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @MaxLength(128, { message: 'El nombre no puede exceder los 128 caracteres' })
    name: string;

    @ApiProperty({ example: 'JWT con guards globales', required: false })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    @MaxLength(512, { message: 'La descripción no puede exceder los 512 caracteres' })
    description?: string;

    @ApiProperty({ example: false, required: false })
    @IsOptional()
    @IsBoolean({ message: 'El campo completado debe ser un valor booleano' })
    completed?: boolean;

    @ApiProperty({ example: '2026-07-15', required: false })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de vencimiento debe tener un formato de fecha válido' })
    dueDate?: string;

    @ApiProperty({ example: 'cma12bc3d0000xyz', description: 'ID del proyecto' })
    @IsString({ message: 'El ID del proyecto debe ser una cadena de texto' })
    projectId: string;

    @ApiProperty({ example: 'cma12bc3d0000xyz', description: 'ID del responsable', required: false })
    @IsOptional()
    @IsString({ message: 'El ID del responsable debe ser una cadena de texto' })
    assigneeId?: string;
}