import { Test, TestingModule } from '@nestjs/testing';
import { FolderService } from '../modules/folder/folder.service';
import { PrismaService } from '../services/prisma.service';
import { Folder, User } from '@prisma/client';

describe('crud - FolderService', () => {
  let user: User;
  let rootFolder: Folder;
  let service: FolderService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FolderService, PrismaService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<FolderService>(FolderService);
  });

  beforeEach(async () => {
    user = await prisma.user.create({
      data: {
        email: 'teste@mail.com',
        password: 'some password',
        username: 'some username',
      },
    });

    rootFolder = await prisma.folder.create({
      data: { name: 'root folder', userId: user.id },
    });
  });

  afterEach(async () => {
    await prisma.subFolderRelation.deleteMany({});
    await prisma.folder.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
  });

  describe('create', () => {
    it('should create folder', async () => {
      const createdFolder = await service.create({
        userId: user.id,
        containerId: rootFolder.id,
        name: 'new folder',
      });

      const existingFolders = await prisma.folder.findMany({
        where: {
          userId: user.id,
        },
      });

      expect(createdFolder.name).toBe('new folder');
      expect(createdFolder.userId).toBe(user.id);
      expect(createdFolder.status).toBe('created');

      expect(existingFolders.length).toBe(2);
    });

    it('should create two folders', async () => {
      await service.create({
        userId: user.id,
        containerId: rootFolder.id,
        name: 'new folder',
      });

      const anotherCreatedFolder = await service.create({
        userId: user.id,
        containerId: rootFolder.id,
        name: 'another folder',
      });

      const existingFolders = await prisma.folder.findMany({});

      expect(anotherCreatedFolder.name).toBe('another folder');
      expect(anotherCreatedFolder.userId).toBe(user.id);
      expect(anotherCreatedFolder.status).toBe('created');

      expect(existingFolders.length).toBe(3);
    });

    it('should create two depth folder', async () => {
      const createdFolder = await service.create({
        userId: user.id,
        containerId: rootFolder.id,
        name: 'new folder',
      });

      await service.create({
        userId: user.id,
        containerId: createdFolder.id,
        name: 'another folder',
      });

      const existingFolders = await prisma.folder.findMany({
        where: {
          userId: user.id,
        },
      });

      expect(existingFolders.length).toBe(3);
    });
  });

  describe('findAll', () => {
    it('should find root folder alone', async () => {
      const foundTree = await service.findAll(user.id);

      expect(foundTree.id).toBe(rootFolder.id);
      expect(foundTree.subFolders.length).toBe(0);
    });

    it('should find root folder with single folder', async () => {
      const createdFolder = await service.create({
        containerId: rootFolder.id,
        userId: user.id,
        name: 'new folder',
      });

      const foundTree = await service.findAll(user.id);

      expect(foundTree.subFolders.length).toBe(1);
      expect(foundTree.subFolders[0].id).toBe(createdFolder.id);
    });

    it('should find root folder with two folder', async () => {
      const createdFolder = await service.create({
        containerId: rootFolder.id,
        userId: user.id,
        name: 'new folder',
      });

      const anotherCreatedFolder = await service.create({
        containerId: rootFolder.id,
        userId: user.id,
        name: 'another folder',
      });

      const foundTree = await service.findAll(user.id);

      expect(foundTree.subFolders.length).toBe(2);
      expect(foundTree.subFolders[0].id).toBe(createdFolder.id);
      expect(foundTree.subFolders[1].id).toBe(anotherCreatedFolder.id);
    });

    it('should find root folder with two depth folder', async () => {
      const createdFolder = await service.create({
        containerId: rootFolder.id,
        userId: user.id,
        name: 'new folder',
      });

      const anotherCreatedFolder = await service.create({
        containerId: createdFolder.id,
        userId: user.id,
        name: 'another folder',
      });

      const foundTree = await service.findAll(user.id);

      expect(foundTree.subFolders.length).toBe(1);
      expect(foundTree.subFolders[0].id).toBe(createdFolder.id);
      expect(foundTree.subFolders[0].subFolders.length).toBe(1);
      expect(foundTree.subFolders[0].subFolders[0].id).toBe(
        anotherCreatedFolder.id,
      );
    });
  });

  describe('update', () => {
    it('should update folder name', async () => {
      const udpatedFolder = await service.update(
        rootFolder.id,
        { name: 'new folder name' },
        user.id,
      );

      expect(udpatedFolder.name).toBe('new folder name');
    });
  });

  describe('move', () => {
    it('should move folder', async () => {
      const createdFolder = await service.create({
        containerId: rootFolder.id,
        userId: user.id,
        name: 'new folder',
      });

      const anotherCreatedFolder = await service.create({
        containerId: rootFolder.id,
        userId: user.id,
        name: 'another folder',
      });

      await service.move(anotherCreatedFolder.id, rootFolder.id, user.id);

      const folderTree = await service.findAll(user.id);

      expect(folderTree.subFolders.length).toBe(2);
      expect(folderTree.subFolders[0].id).toBe(createdFolder.id);
      expect(folderTree.subFolders[1].id).toBe(anotherCreatedFolder.id);
    });

    it('should move conservatively', async () => {
      const createdFolder = await service.create({
        containerId: rootFolder.id,
        userId: user.id,
        name: 'new folder',
      });

      const anotherCreatedFolder = await service.create({
        containerId: rootFolder.id,
        userId: user.id,
        name: 'another folder',
      });

      await service.move(anotherCreatedFolder.id, rootFolder.id, user.id);
      await service.move(anotherCreatedFolder.id, createdFolder.id, user.id);

      const folderTree = await service.findAll(user.id);

      expect(folderTree.subFolders.length).toBe(1);
      expect(folderTree.subFolders[0].subFolders.length).toBe(1);
      expect(folderTree.subFolders[0].id).toBe(createdFolder.id);
      expect(folderTree.subFolders[0].subFolders[0].id).toBe(
        anotherCreatedFolder.id,
      );
    });
  });

  describe('remove', () => {
    it('should not remove root folder', () => {
      expect(async () => {
        await service.remove(rootFolder.id, user.id);
      }).rejects.toThrow();
    });

    it('should not find removed folder', async () => {
      const createdFolder = await service.create({
        containerId: rootFolder.id,
        userId: user.id,
        name: 'new folder',
      });

      await service.remove(createdFolder.id, user.id);

      const folderTree = await service.findAll(user.id);

      expect(folderTree.subFolders.length).toBe(0);
    });

    it('should not find removed folder tree', async () => {
      const createdFolder = await service.create({
        containerId: rootFolder.id,
        userId: user.id,
        name: 'new folder',
      });

      await service.create({
        containerId: createdFolder.id,
        userId: user.id,
        name: 'another folder',
      });

      await service.remove(createdFolder.id, user.id);

      const folderTree = await service.findAll(user.id);

      expect(folderTree.subFolders.length).toBe(0);
    });
  });
});
