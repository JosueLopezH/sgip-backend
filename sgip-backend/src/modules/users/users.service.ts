import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { RegisterDto } from '../auth/dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService {
  private prisma = new PrismaClient();

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user)
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    return user;
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async create(dto: RegisterDto) {
    const exists = await this.prisma.user.findFirst({
      where: { OR: [{ username: dto.username }, { email: dto.email }] },
    });
    if (exists)
      throw new ConflictException('El usuario o email ya está registrado');

    const password = crypto
      .createHash('sha256')
      .update(dto.password)
      .digest('hex');
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        username: dto.username,
        email: dto.email,
        password,
        role: dto.role ?? 'DEVELOPER',
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findById(id);
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        active: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    await this.prisma.user.update({
      where: { id },
      data: { active: false },
    });
    return { mensaje: 'Usuario desactivado correctamente' };
  }
}
