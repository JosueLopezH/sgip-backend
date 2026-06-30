import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma';

@Injectable()
export class UsersService {
  private prisma = new PrismaClient();

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}