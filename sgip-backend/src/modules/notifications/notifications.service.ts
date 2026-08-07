import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class NotificationsService {
    private prisma = new PrismaClient();

    async findByUser(userId: string) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async markAsRead(id: string) {
        const notification = await this.prisma.notification.findUnique({ where: { id } });
        if (!notification) throw new NotFoundException(`Notificación con id ${id} no encontrada`);
        return this.prisma.notification.update({
            where: { id },
            data: { read: true },
        });
    }

    async markAllAsRead(userId: string) {
        await this.prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true },
        });
        return { mensaje: 'Todas las notificaciones marcadas como leídas' };
    }

    async create(userId: string, title: string, message: string, type: 'INFO' | 'WARNING' | 'ALERT' = 'INFO') {
        return this.prisma.notification.create({
            data: { userId, title, message, type },
        });
    }

    async remove(id: string) {
        const notification = await this.prisma.notification.findUnique({ where: { id } });
        if (!notification) throw new NotFoundException(`Notificación con id ${id} no encontrada`);
        await this.prisma.notification.delete({ where: { id } });
        return { mensaje: 'Notificación eliminada correctamente' };
    }
}