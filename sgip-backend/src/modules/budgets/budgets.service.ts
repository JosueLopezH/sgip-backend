import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class BudgetsService {
  private prisma = new PrismaClient();

  async findByProject(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project)
      throw new NotFoundException(`Proyecto con id ${projectId} no encontrado`);

    const expenses = await this.prisma.expense.findMany({
      where: { projectId },
      include: {
        user: { select: { id: true, name: true, username: true } },
      },
      orderBy: { date: 'desc' },
    });

    const totalGastado = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const presupuesto = Number(project.budget ?? 0);
    const disponible = presupuesto - totalGastado;
    const porcentajeUsado =
      presupuesto > 0 ? (totalGastado / presupuesto) * 100 : 0;

    return {
      proyecto: { id: project.id, nombre: project.name, presupuesto },
      resumen: {
        totalGastado: parseFloat(totalGastado.toFixed(2)),
        disponible: parseFloat(disponible.toFixed(2)),
        porcentajeUsado: parseFloat(porcentajeUsado.toFixed(2)),
      },
      gastos: expenses,
    };
  }

  async findOne(id: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, username: true } },
      },
    });
    if (!expense)
      throw new NotFoundException(`Gasto con id ${id} no encontrado`);
    return expense;
  }

  async create(dto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        concept: dto.concept,
        amount: dto.amount,
        date: new Date(dto.date),
        notes: dto.notes,
        projectId: dto.projectId,
        registeredBy: dto.registeredBy,
      },
      include: {
        project: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, username: true } },
      },
    });
  }

  async update(id: string, dto: UpdateExpenseDto) {
    await this.findOne(id);
    return this.prisma.expense.update({
      where: { id },
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : undefined,
      },
      include: {
        project: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, username: true } },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.expense.delete({ where: { id } });
    return { mensaje: 'Gasto eliminado correctamente' };
  }
}
