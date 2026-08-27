import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/entities/user.entity';

export class ProjectEntity {
    @ApiProperty({ example: 'cma12bc3d0000xyz' })
    id: string;

    @ApiProperty({ example: 'SGIP v1.0' })
    name: string;

    @ApiProperty({ example: 'Sistema de Gestión Integral de Proyectos', required: false })
    description?: string;

    @ApiProperty({ example: 'PENDING', enum: ['PENDING', 'STARTED', 'IN_PROCESS', 'COMPLETED', 'CANCELED'] })
    status: string;

    @ApiProperty({ example: 50000.00, required: false })
    budget?: number;

    @ApiProperty({ example: '2026-07-01T00:00:00.000Z', required: false })
    startDate?: Date;

    @ApiProperty({ example: '2026-12-31T00:00:00.000Z', required: false })
    endDate?: Date;

    @ApiProperty({ example: '2026-07-01T00:00:00.000Z' })
    createdAt: Date;

    @ApiProperty({ type: UserEntity })
    manager: UserEntity;
}