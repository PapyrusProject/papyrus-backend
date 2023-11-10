import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { User } from '@prisma/client';
import { PrismaService } from '../../services/prisma.service';
import { EmmitedEvents } from '../../interfaces/EmmitedEvents';

@Injectable()
export class FolderUserCreateEventListener {
  constructor(private prisma: PrismaService) {}

  @OnEvent(EmmitedEvents.USER_CREATED)
  async handleUserCreated(createdUser: User) {
    const newFolder = await this.prisma.folder.create({
      data: {
        name: 'Workspace',
        userId: createdUser.id,
      },
    });

    await this.prisma.subFolderRelation.create({
      data: {
        containerId: newFolder.id,
        subFolderIds: [],
      },
    });
  }
}
