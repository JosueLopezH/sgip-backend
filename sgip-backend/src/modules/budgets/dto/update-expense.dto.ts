import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateExpenseDto {
  @IsOptional()
  @IsString({ message: 'El concepto debe ser una cadena de texto' })
  @MaxLength(128, {
    message: 'El concepto no puede exceder los 128 caracteres',
  })
  concept?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El monto debe ser un número' })
  @Min(0.01, { message: 'El monto debe ser mayor a cero' })
  amount?: number;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'La fecha debe tener un formato válido (YYYY-MM-DD)' },
  )
  date?: string;

  @IsOptional()
  @IsString({ message: 'Las notas deben ser una cadena de texto' })
  @MaxLength(512, { message: 'Las notas no pueden exceder los 512 caracteres' })
  notes?: string;
}
