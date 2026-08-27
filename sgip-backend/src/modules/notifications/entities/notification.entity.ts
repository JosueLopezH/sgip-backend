import { ApiProperty } from '@nestjs/swagger';

export class NotificationEntity {
    @ApiProperty({ example: 'cma12bc3d0000xyz' })
    id: string;

    @ApiProperty({ example: 'Proyecto actualizado' })
    title: string;

    @ApiProperty({ example: 'El proyecto SGIP cambió su estado a IN_PROCESS' })
    message: string;

    @ApiProperty({ example: 'INFO', enum: ['INFO', 'WARNING', 'ALERT'] })
    type: string;

    @ApiProperty({ example: false })
    read: boolean;

    @ApiProperty({ example: '2026-07-01T00:00:00.000Z' })
    createdAt: Date;
}