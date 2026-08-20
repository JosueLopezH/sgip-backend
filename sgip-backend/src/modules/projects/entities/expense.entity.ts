import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/entities/user.entity';

class ProjectBasicEntity {
    @ApiProperty({ example: 'cma12bc3d0000xyz' })
    id: string;

    @ApiProperty({ example: 'SGIP v1.0' })
    name: string;
}

export class ExpenseEntity {
    @ApiProperty({ example: 'cma12bc3d0000xyz' })
    id: string;

    @ApiProperty({ example: 'Licencias de software' })
    concept: string;

    @ApiProperty({ example: 5000.00 })
    amount: number;

    @ApiProperty({ example: '2026-07-01T00:00:00.000Z' })
    date: Date;

    @ApiProperty({ example: 'Pago anual de herramientas', required: false })
    notes?: string;

    @ApiProperty({ example: '2026-07-01T00:00:00.000Z' })
    createdAt: Date;

    @ApiProperty({ type: ProjectBasicEntity })
    project: ProjectBasicEntity;

    @ApiProperty({ type: UserEntity })
    user: UserEntity;
}

export class BudgetSummaryEntity {
    @ApiProperty({ example: { id: 'cma12bc3d0000xyz', nombre: 'SGIP v1.0', presupuesto: 50000 } })
    proyecto: object;

    @ApiProperty({ example: { totalGastado: 5000, disponible: 45000, porcentajeUsado: 10 } })
    resumen: object;

    @ApiProperty({ type: [ExpenseEntity] })
    gastos: ExpenseEntity[];
}