import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Folder, User } from '@prisma/client';
import { FolderModule } from '../modules/folder/folder.module';
import { PrismaService } from '../services/prisma.service';
import * as request from 'supertest';

describe('crud folder controller', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let user: User;
  let rootFolder: Folder;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [FolderModule],
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    app = moduleRef.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    user = await prisma.user.create({
      data: {
        username: 'username',
        email: 'test@mail.com',
        password: 'password',
      },
    });

    rootFolder = await prisma.folder.create({
      data: {
        name: 'root folder',
        userId: user.id,
      },
    });
  });

  afterEach(async () => {
    await prisma.folder.deleteMany({});
    await prisma.subFolderRelation.deleteMany({});
    await prisma.user.deleteMany({});
  });

  it('should create folder', async () => {
    await request(app.getHttpServer())
      .post('/folder/')
      .set('Content-Type', 'application/json')
      .send({
        userId: user.id,
        containerId: rootFolder.id,
        name: 'new folder',
      })
      .expect(201);
  });

  it('should find folders', async () => {
    await request(app.getHttpServer()).get(`/folder/${user.id}`).expect(200);
  });

  it('should update folder', async () => {
    await request(app.getHttpServer())
      .patch(`/folder/${user.id}/${rootFolder.id}`)
      .set('Content-Type', 'application/json')
      .send({
        name: 'new folder name',
      })
      .expect(200);
  });

  it('should remove created folder', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/folder/')
      .set('Content-Type', 'application/json')
      .send({
        userId: user.id,
        containerId: rootFolder.id,
        name: 'new folder',
      })
      .expect(201);

    const newFolderId = body.id;

    await request(app.getHttpServer())
      .delete(`/folder/${user.id}/${newFolderId}`)
      .expect(200);
  });
});
