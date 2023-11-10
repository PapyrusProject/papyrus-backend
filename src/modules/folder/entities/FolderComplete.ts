import { Folder } from '@prisma/client';

export interface FolderComplete extends Folder {
  subFolders: FolderComplete[];
}

export const folderCompleteFromPrisma = (folder: Folder): FolderComplete => ({
  ...folder,
  subFolders: [],
});

export const folderCompleteArrayFromPrisma = (
  folderList: Array<Folder>,
): Array<FolderComplete> =>
  folderList.map((folder) => folderCompleteFromPrisma(folder));
