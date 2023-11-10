import { Module } from '@nestjs/common';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { PrismaService } from '../../services/prisma.service';
import { FolderUserCreateEventListener } from './folder-user-create-event-listener';

@Module({
  controllers: [FolderController],
  providers: [FolderService, PrismaService, FolderUserCreateEventListener],
})
export class FolderModule {}
