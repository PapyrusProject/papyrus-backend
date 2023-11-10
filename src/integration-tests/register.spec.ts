import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthModule } from '../modules/auth/auth.module';
import { PrismaService } from '../services/prisma.service';
import { INestApplication } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

describe('auth register', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot(), AuthModule],
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await prisma.user.deleteMany({});
  });

  it('should register some user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .set('Content-Type', 'application/json')
      .send({
        email: 'test@mail.com',
        username: 'username',
        password: 'password',
      })
      .expect(201);
  });

  it('should not register same user', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test@mail.com',
        username: 'username',
        password: 'password',
      })
      .set('Content-Type', 'application/json')
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test@mail.com',
        username: 'username',
        password: 'password',
      })
      .set('Content-Type', 'application/json')
      .expect(400);
  });

  it('should not register invalid email', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'testmail.com',
        username: 'username',
        password: 'password',
      })
      .set('Content-Type', 'application/json')
      .expect(400);
  });
});
