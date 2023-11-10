import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './modules/auth/auth.module';
import { FolderModule } from './modules/folder/folder.module';

@Module({
  imports: [EventEmitterModule.forRoot(), AuthModule, FolderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
