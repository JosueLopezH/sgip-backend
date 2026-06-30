import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) return null;
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    if (user.password !== hash) return null;
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: { id: string; username: string; role: string }) {
    const payload = { sub: user.id, username: user.username, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(dto: RegisterDto) {
    const user = await this.usersService.create(dto);
    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      usuario: user,
      access_token: this.jwtService.sign(payload),
    };
  }
}