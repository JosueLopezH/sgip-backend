import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ReportsService {
    private prisma = new PrismaClient();

    async getProjectSummary(projectId: string) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: {
                manager: { select: { id: true, name: true, username: true } },
                tasks: {
                    include: {
                        assignee: { select: { id: true, name: true } },
                    },
                },
                expenses: true,
            },
        });

        if (!project) return { error: 'Proyecto no encontrado' };

        const totalTareas = project.tasks.length;
        const tareasCompletadas = project.tasks.filter((t) => t.completed).length;
        const tareasPendientes = totalTareas - tareasCompletadas;
        const porcentajeAvance = totalTareas > 0
            ? parseFloat(((tareasCompletadas / totalTareas) * 100).toFixed(2))
            : 0;

        const totalGastado = project.expenses.reduce((sum, e) => sum + Number(e.amount), 0);
        const presupuesto = Number(project.budget ?? 0);
        const disponible = presupuesto - totalGastado;

        return {
            proyecto: {
                id: project.id,
                nombre: project.name,
                descripcion: project.description,
                status: project.status,
                manager: project.manager,
                fechaInicio: project.startDate,
                fechaFin: project.endDate,
            },
            tareas: {
                total: totalTareas,
                completadas: tareasCompletadas,
                pendientes: tareasPendientes,
                porcentajeAvance,
                detalle: project.tasks,
            },
            presupuesto: {
                asignado: presupuesto,
                gastado: parseFloat(totalGastado.toFixed(2)),
                disponible: parseFloat(disponible.toFixed(2)),
                porcentajeUsado: presupuesto > 0
                    ? parseFloat(((totalGastado / presupuesto) * 100).toFixed(2))
                    : 0,
            },
        };
    }

    async getGeneralDashboard() {
        const [
            totalProyectos,
            proyectosPorStatus,
            totalTareas,
            tareasCompletadas,
            totalUsuarios,
            totalGastos,
        ] = await Promise.all([
            this.prisma.project.count(),
            this.prisma.project.groupBy({
                by: ['status'],
                _count: { status: true },
            }),
            this.prisma.task.count(),
            this.prisma.task.count({ where: { completed: true } }),
            this.prisma.user.count({ where: { active: true } }),
            this.prisma.expense.aggregate({ _sum: { amount: true } }),
        ]);

        return {
            resumenGeneral: {
                totalProyectos,
                totalTareas,
                tareasCompletadas,
                tareasPendientes: totalTareas - tareasCompletadas,
                porcentajeAvanceGlobal: totalTareas > 0
                    ? parseFloat(((tareasCompletadas / totalTareas) * 100).toFixed(2))
                    : 0,
                totalUsuariosActivos: totalUsuarios,
                totalGastadoGlobal: parseFloat(
                    (Number(totalGastos._sum.amount ?? 0)).toFixed(2)
                ),
            },
            proyectosPorStatus: proyectosPorStatus.map((p) => ({
                status: p.status,
                cantidad: p._count.status,
            })),
        };
    }
}