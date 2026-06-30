import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import { RegisterDto } from '../auth/dto/register.dto';


@Injectable()
export class UsersService {
  private prisma = new PrismaClient();

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(dto: RegisterDto) {
    const exists = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: dto.username }, { email: dto.email }],
      },
    });

    if (exists) {
      throw new ConflictException('El usuario o email ya está registrado');
    }

    const password = crypto.createHash('sha256').update(dto.password).digest('hex');

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        username: dto.username,
        email: dto.email,
        password,
        role: dto.role ?? 'DEVELOPER',
      },
    });

    const { password: _, ...result } = user;
    return result;
  }

}