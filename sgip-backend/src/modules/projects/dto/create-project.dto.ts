import { IsDateString, IsDecimal, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export enum Status {
  PENDING = 'PENDING',
  STARTED = 'STARTED',
  IN_PROCESS = 'IN_PROCESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export class CreateProjectDto {
  @IsString()
  @MaxLength(128)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(512)
  description?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsDecimal()
  budget?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsString()
  managerId: string;
}