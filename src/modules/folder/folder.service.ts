import { Injectable } from '@nestjs/common';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { PrismaService } from '../../services/prisma.service';
import {
  FolderComplete,
  folderCompleteFromPrisma,
} from './entities/FolderComplete';
import { queryByFloodFill } from './utils/queryByFloodfill';

@Injectable()
export class FolderService {
  constructor(private prisma: PrismaService) {}

  async create(createFolderDto: CreateFolderDto) {
    return await this.prisma.$transaction(async (transaction) => {
      const newFolder = await transaction.folder.create({
        data: {
          name: createFolderDto.name,
          userId: createFolderDto.userId,
        },
      });

      // Creates folders subfolders relation
      await transaction.subFolderRelation.create({
        data: {
          containerId: newFolder.id,
          subFolderIds: [],
        },
      });

      // Updates folder's container
      const existingFolderRelation =
        await transaction.subFolderRelation.findFirst({
          where: {
            containerId: createFolderDto.containerId,
          },
        });

      if (existingFolderRelation === null) {
        await transaction.subFolderRelation.create({
          data: {
            containerId: createFolderDto.containerId,
            subFolderIds: [newFolder.id],
          },
        });
      } else {
        await transaction.subFolderRelation.update({
          data: {
            subFolderIds: [
              ...existingFolderRelation.subFolderIds,
              newFolder.id,
            ],
          },
          where: {
            containerId: createFolderDto.containerId,
          },
        });
      }

      return newFolder;
    });
  }

  async findAll(userId: string) {
    return await this.prisma.$transaction(async (transaction) => {
      const rootFolder: FolderComplete = folderCompleteFromPrisma(
        await transaction.folder.findFirst({
          where: { userId },
        }),
      );

      return queryByFloodFill(rootFolder, transaction);
    });
  }

  async update(id: string, updateFolderDto: UpdateFolderDto, userId: string) {
    return await this.prisma.folder.update({
      data: {
        name: updateFolderDto.name,
      },
      where: {
        id,
        userId: userId,
        status: 'created',
      },
    });
  }

  async move(id: string, newFolderId: string, userId: string) {
    return await this.prisma.$transaction(async (transaction) => {
      // Updates previous container
      const existingFolderRelation =
        await transaction.subFolderRelation.findFirstOrThrow({
          where: {
            subFolderIds: {
              hasSome: [id],
            },
          },
        });

      await this.prisma.subFolderRelation.update({
        where: {
          containerId: existingFolderRelation.containerId,
        },
        data: {
          subFolderIds: existingFolderRelation.subFolderIds.filter(
            (ids) => ids !== id,
          ),
        },
      });

      // Updates new container
      const newFolderRelation =
        await transaction.subFolderRelation.findFirstOrThrow({
          where: {
            containerId: newFolderId,
          },
        });

      return transaction.subFolderRelation.update({
        data: {
          subFolderIds: [...newFolderRelation.subFolderIds, id],
        },
        where: {
          containerId: newFolderRelation.containerId,
        },
      });
    });
  }

  async remove(id: string, userId: string) {
    return await this.prisma.$transaction(async (transaction) => {
      try {
        await transaction.subFolderRelation.findFirstOrThrow({
          where: {
            subFolderIds: { hasSome: [id] },
          },
        });
      } catch (error) {
        throw new Error('Cannot remove root folder');
      }

      return await transaction.folder.update({
        where: {
          id,
          userId,
        },
        data: {
          status: 'deleted',
        },
      });
    });
  }
}
