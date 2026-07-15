import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

import { Status } from './create-project.dto';

export class UpdateProjectDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(128, { message: 'El nombre no puede exceder los 128 caracteres' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(512, { message: 'La descripción no puede exceder los 512 caracteres' })
  description?: string;

  @IsOptional()
  @IsEnum(Status, { message: 'El estado debe ser un valor válido' })
  status?: Status;

  @IsOptional()
  @IsNumber({}, { message: 'El presupuesto debe ser un número' })
  budget?: number;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de inicio debe tener un formato de fecha válido' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de finalización debe tener un formato de fecha válido' })
 
  endDate?: string;
}