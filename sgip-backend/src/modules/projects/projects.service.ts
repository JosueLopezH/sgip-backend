import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateProjectDto, Status } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

interface FindAllParams {
  page?: string;
  limit?: string;
  status?: Status;
  managerId?: string;
}

@Injectable()
export class ProjectsService {
  private prisma = new PrismaClient();

  async findAll({ page, limit, status, managerId }: FindAllParams) {
    const pageNum = parseInt(page ?? '1', 10);
    const limitNum = parseInt(limit ?? '10', 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (status) where.status = status;
    if (managerId) where.managerId = managerId;

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limitNum,
        include: {
          manager: { select: { id: true, name: true, username: true } },
          tasks: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        manager: { select: { id: true, name: true, username: true } },
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, username: true } },
          },
        },
      },
    });
    if (!project) throw new NotFoundException(`Proyecto con id ${id} no encontrado`);
    return project;
  }

  async create(dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        status: dto.status ?? 'PENDING',
        budget: dto.budget,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        managerId: dto.managerId,
      },
      include: {
        manager: { select: { id: true, name: true, username: true } },
      },
    });
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.findOne(id);
    return this.prisma.project.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
      include: {
        manager: { select: { id: true, name: true, username: true } },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.project.delete({ where: { id } });
    return { mensaje: 'Proyecto eliminado correctamente' };
  }
}