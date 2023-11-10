import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';

@Controller({
  path: 'folder',
  version: '1',
})
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post()
  create(@Body() createFolderDto: CreateFolderDto) {
    return this.folderService.create(createFolderDto);
  }

  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.folderService.findAll(userId);
  }

  @Patch(':userId/:id')
  update(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() updateFolderDto: UpdateFolderDto,
  ) {
    return this.folderService.update(id, updateFolderDto, userId);
  }

  @Delete(':userId/:id')
  remove(@Param('id') id: string, @Param('userId') userId: string) {
    return this.folderService.remove(id, userId);
  }
}
