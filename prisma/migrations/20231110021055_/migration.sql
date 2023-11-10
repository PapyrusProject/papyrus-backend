/*
  Warnings:

  - You are about to drop the `user_pages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_table_cells` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_table_columns` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_tables` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_workspace_blocks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_workspace_tasks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_workspaces` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FolderStatus" AS ENUM ('created', 'deleted');

-- DropForeignKey
ALTER TABLE "user_pages" DROP CONSTRAINT "user_pages_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_pages" DROP CONSTRAINT "user_pages_workspace_id_fkey";

-- DropForeignKey
ALTER TABLE "user_table_cells" DROP CONSTRAINT "user_table_cells_column_id_fkey";

-- DropForeignKey
ALTER TABLE "user_table_columns" DROP CONSTRAINT "user_table_columns_table_id_fkey";

-- DropForeignKey
ALTER TABLE "user_tables" DROP CONSTRAINT "user_tables_page_id_fkey";

-- DropForeignKey
ALTER TABLE "user_workspace_blocks" DROP CONSTRAINT "user_workspace_blocks_page_id_fkey";

-- DropForeignKey
ALTER TABLE "user_workspace_blocks" DROP CONSTRAINT "user_workspace_blocks_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_workspace_blocks" DROP CONSTRAINT "user_workspace_blocks_workspace_id_fkey";

-- DropForeignKey
ALTER TABLE "user_workspace_tasks" DROP CONSTRAINT "user_workspace_tasks_page_id_fkey";

-- DropForeignKey
ALTER TABLE "user_workspace_tasks" DROP CONSTRAINT "user_workspace_tasks_task_id_fkey";

-- DropForeignKey
ALTER TABLE "user_workspaces" DROP CONSTRAINT "user_workspaces_user_id_fkey";

-- DropTable
DROP TABLE "user_pages";

-- DropTable
DROP TABLE "user_table_cells";

-- DropTable
DROP TABLE "user_table_columns";

-- DropTable
DROP TABLE "user_tables";

-- DropTable
DROP TABLE "user_workspace_blocks";

-- DropTable
DROP TABLE "user_workspace_tasks";

-- DropTable
DROP TABLE "user_workspaces";

-- DropEnum
DROP TYPE "UserBlockType";

-- DropEnum
DROP TYPE "UserTaskStatus";

-- CreateTable
CREATE TABLE "Folder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "FolderStatus" NOT NULL DEFAULT 'created',
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubFolderRelation" (
    "containerId" TEXT NOT NULL,
    "subFolderIds" TEXT[],

    CONSTRAINT "SubFolderRelation_pkey" PRIMARY KEY ("containerId")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "workSpaceId" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubFolderRelation" ADD CONSTRAINT "SubFolderRelation_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_workSpaceId_fkey" FOREIGN KEY ("workSpaceId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
