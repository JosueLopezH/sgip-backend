import { IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(128, { message: 'El nombre no puede exceder los 128 caracteres' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(512, { message: 'La descripción no puede exceder los 512 caracteres' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'El campo completado debe ser un valor booleano' })
  completed?: boolean;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de vencimiento debe tener un formato de fecha válido' })
  dueDate?: string;

  @IsOptional()
  @IsString({ message: 'El ID del responsable debe ser una cadena de texto' })
  assigneeId?: string;
}