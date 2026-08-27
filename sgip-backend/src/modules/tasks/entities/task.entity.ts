import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/entities/user.entity';

class ProjectBasicEntity {
    @ApiProperty({ example: 'cma12bc3d0000xyz' })
    id: string;

    @ApiProperty({ example: 'SGIP v1.0' })
    name: string;
}

export class TaskEntity {
    @ApiProperty({ example: 'cma12bc3d0000xyz' })
    id: string;

    @ApiProperty({ example: 'Implementar módulo de autenticación' })
    name: string;

    @ApiProperty({ example: 'JWT con guards globales', required: false })
    description?: string;

    @ApiProperty({ example: false })
    completed: boolean;

    @ApiProperty({ example: '2026-07-15T00:00:00.000Z', required: false })
    dueDate?: Date;

    @ApiProperty({ example: '2026-07-01T00:00:00.000Z' })
    createdAt: Date;

    @ApiProperty({ type: ProjectBasicEntity })
    project: ProjectBasicEntity;

    @ApiProperty({ type: UserEntity, required: false })
    assignee?: UserEntity;
}