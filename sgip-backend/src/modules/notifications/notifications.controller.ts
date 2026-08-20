import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { NotificationEntity } from './entities/notification.entity';

class CreateNotificationDto {
  @ApiProperty({ example: 'cma12bc3d0000xyz' })
  @IsString({ message: 'El ID del usuario debe ser una cadena de texto' })
  userId: string;

  @ApiProperty({ example: 'Proyecto actualizado' })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  title: string;

  @ApiProperty({ example: 'El proyecto SGIP cambió su estado a IN_PROCESS' })
  @IsString({ message: 'El mensaje debe ser una cadena de texto' })
  message: string;

  @ApiProperty({ example: 'INFO', enum: ['INFO', 'WARNING', 'ALERT'], required: false })
  @IsOptional()
  @IsEnum(['INFO', 'WARNING', 'ALERT'], { message: 'El tipo debe ser INFO, WARNING o ALERT' })
  type?: 'INFO' | 'WARNING' | 'ALERT';
}

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener notificaciones de un usuario' })
  @ApiResponse({ status: 200, description: 'Lista de notificaciones', type: [NotificationEntity] })
  findByUser(@Param('userId') userId: string) {
    return this.notificationsService.findByUser(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva notificación' })
  @ApiResponse({ status: 201, description: 'Notificación creada', type: NotificationEntity })
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(dto.userId, dto.title, dto.message, dto.type);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marcar una notificación como leída' })
  @ApiResponse({ status: 200, description: 'Notificación marcada como leída', type: NotificationEntity })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada' })
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch('user/:userId/read-all')
  @ApiOperation({ summary: 'Marcar todas las notificaciones de un usuario como leídas' })
  @ApiResponse({ status: 200, description: 'Todas las notificaciones marcadas como leídas' })
  markAllAsRead(@Param('userId') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una notificación' })
  @ApiResponse({ status: 200, description: 'Notificación eliminada' })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada' })
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}