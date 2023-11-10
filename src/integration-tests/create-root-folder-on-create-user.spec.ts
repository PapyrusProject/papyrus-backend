import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { AuthModule } from '../modules/auth/auth.module';
import { AuthService } from '../modules/auth/auth.service';
import { FolderModule } from '../modules/folder/folder.module';
import { PrismaService } from '../services/prisma.service';

describe('create root folder on create user', () => {
  let prisma: PrismaService;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot(), FolderModule, AuthModule],
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);
    authService = moduleRef.get<AuthService>(AuthService);
    const app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await prisma.subFolderRelation.deleteMany({});
    await prisma.folder.deleteMany({});
    await prisma.user.deleteMany({});
  });

  it('should not contain folder before create user', async () => {
    const existingFolders = await prisma.folder.findMany({});

    expect(existingFolders.length).toBe(0);
  });

  it('should create root folder', async () => {
    await authService.register({
      email: 'test@mail.com',
      username: 'username',
      password: 'password',
    });

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });

    const existingFolders = await prisma.folder.findMany();
    expect(existingFolders.length).toBe(1);

    const existingFoldersRelations = await prisma.subFolderRelation.findMany();
    expect(existingFoldersRelations.length).toBe(1);
  });
});
