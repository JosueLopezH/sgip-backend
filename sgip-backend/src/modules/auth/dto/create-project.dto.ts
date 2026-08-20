import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export enum Status {
    PENDING = 'PENDING',
    STARTED = 'STARTED',
    IN_PROCESS = 'IN_PROCESS',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED',
}

export class CreateProjectDto {
    @ApiProperty({ example: 'SGIP v1.0' })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @MaxLength(128, { message: 'El nombre no puede exceder los 128 caracteres' })
    name: string;

    @ApiProperty({ example: 'Sistema de Gestión Integral de Proyectos', required: false })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    @MaxLength(512, { message: 'La descripción no puede exceder los 512 caracteres' })
    description?: string;

    @ApiProperty({ example: 'PENDING', enum: Status, required: false })
    @IsOptional()
    @IsEnum(Status, { message: 'El estado debe ser un valor válido' })
    status?: Status;

    @ApiProperty({ example: 50000, required: false })
    @IsOptional()
    @IsNumber({}, { message: 'El presupuesto debe ser un número' })
    budget?: number;

    @ApiProperty({ example: '2026-07-01', required: false })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de inicio debe tener un formato de fecha válido' })
    startDate?: string;

    @ApiProperty({ example: '2026-12-31', required: false })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de finalización debe tener un formato de fecha válido' })
    endDate?: string;

    @ApiProperty({ example: 'cma12bc3d0000xyz', description: 'ID del manager del proyecto' })
    @IsString({ message: 'El ID del gerente debe ser una cadena de texto' })
    managerId: string;
}