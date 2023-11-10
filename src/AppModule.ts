import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { FolderModule } from './modules/folder/folder.module';

@Module({
  imports: [AuthModule, FolderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
