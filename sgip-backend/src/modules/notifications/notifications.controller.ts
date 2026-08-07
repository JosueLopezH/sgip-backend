import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { NotificationsService } from './notifications.service';

class CreateNotificationDto {
    @IsString({ message: 'El ID del usuario debe ser una cadena de texto' })
    userId: string;

    @IsString({ message: 'El título debe ser una cadena de texto' })
    title: string;

    @IsString({ message: 'El mensaje debe ser una cadena de texto' })
    message: string;

    @IsOptional()
    @IsEnum(['INFO', 'WARNING', 'ALERT'], { message: 'El tipo debe ser INFO, WARNING o ALERT' })
    type?: 'INFO' | 'WARNING' | 'ALERT';
}

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get('user/:userId')
    findByUser(@Param('userId') userId: string) {
        return this.notificationsService.findByUser(userId);
    }

    @Post()
    create(@Body() dto: CreateNotificationDto) {
        return this.notificationsService.create(dto.userId, dto.title, dto.message, dto.type);
    }

    @Patch(':id/read')
    markAsRead(@Param('id') id: string) {
        return this.notificationsService.markAsRead(id);
    }

    @Patch('user/:userId/read-all')
    markAllAsRead(@Param('userId') userId: string) {
        return this.notificationsService.markAllAsRead(userId);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.notificationsService.remove(id);
    }
}