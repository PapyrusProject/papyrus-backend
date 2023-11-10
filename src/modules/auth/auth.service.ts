import { Injectable } from '@nestjs/common';
import { compareSync, hashSync } from 'bcrypt';
import { RegisterDTO } from './RegisterDTO';
import { LoginDTO } from './LoginDTO';
import { sign } from 'jsonwebtoken';
import { PrismaService } from '../../services/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EmmitedEvents } from '../../interfaces/EmmitedEvents';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private eventEmmiter: EventEmitter2,
  ) {}

  async register({ username, email, password }: RegisterDTO) {
    if (!username || !email || !password) {
      throw new Error('Missing arguments');
    }

    if (!email.includes('@')) {
      throw new Error('Invalid email');
    }

    const userExists = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (userExists?.username === username || userExists?.email === email) {
      throw new Error('User already exists');
    }

    const hashedPassword = hashSync(password, 10);

    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        created_at: true,
        updated_at: true,
      },
    });

    this.eventEmmiter.emit(EmmitedEvents.USER_CREATED, user);

    return user;
  }

  async login({ username, password }: LoginDTO) {
    if (!username || !password) {
      throw new Error('Missing arguments');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const IsValidPassword = compareSync(password, user.password);

    if (!IsValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = sign({ id: user.id }, String(process.env.JWT_SECRET), {
      expiresIn: '1h',
    });

    return token;
  }
}
