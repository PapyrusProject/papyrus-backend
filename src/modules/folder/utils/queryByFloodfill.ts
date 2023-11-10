import { Prisma, PrismaClient } from '@prisma/client';
import {
  FolderComplete,
  folderCompleteArrayFromPrisma,
} from '../entities/FolderComplete';
import { DefaultArgs } from '@prisma/client/runtime/library';

type Transaction = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

const recursiveQuery = async (
  folder: FolderComplete,
  transaction: Transaction,
) => {
  const relation = await transaction.subFolderRelation.findFirst({
    where: { containerId: folder.id },
  });

  if (relation === null) {
    return [];
  }

  const subFolders = folderCompleteArrayFromPrisma(
    await transaction.folder.findMany({
      where: {
        id: {
          in: relation.subFolderIds,
        },
        status: 'created',
      },
    }),
  );

  folder.subFolders = [...folder.subFolders, ...subFolders];

  return subFolders;
};

/**
 * Fills the folder tree with subfolders recursively.
 * @param folder
 * @param transaction
 * @returns
 */
export const queryByFloodFill = async (
  folder: FolderComplete,
  transaction: Transaction,
) => {
  let pendingFolders: Array<FolderComplete> = await recursiveQuery(
    folder,
    transaction,
  );

  while (pendingFolders.length > 0) {
    const nextFolder = pendingFolders.pop();
    const newFolders = await recursiveQuery(nextFolder, transaction);
    pendingFolders.push(...newFolders);
  }

  return folder;
};
