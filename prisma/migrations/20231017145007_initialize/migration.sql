-- CreateEnum
CREATE TYPE "UserBlockType" AS ENUM ('TEXT', 'TITLE', 'LIST');

-- CreateEnum
CREATE TYPE "UserTaskStatus" AS ENUM ('TODO', 'PROGRESS', 'COMPLETED', 'HOLD');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_workspaces" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "members_id" TEXT[],
    "workpace_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_pages" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "page_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,

    CONSTRAINT "user_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_workspace_blocks" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "block_id" TEXT NOT NULL,
    "page_id" TEXT NOT NULL,
    "type" "UserBlockType" NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_workspace_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_workspace_tasks" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "page_id" TEXT NOT NULL,
    "status" "UserTaskStatus" NOT NULL DEFAULT 'TODO',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_workspace_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_tables" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "page_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_table_columns" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "table_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_table_columns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_table_cells" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "column_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_table_cells_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "user_workspaces" ADD CONSTRAINT "user_workspaces_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_pages" ADD CONSTRAINT "user_pages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_pages" ADD CONSTRAINT "user_pages_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "user_workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_workspace_blocks" ADD CONSTRAINT "user_workspace_blocks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_workspace_blocks" ADD CONSTRAINT "user_workspace_blocks_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "user_workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_workspace_blocks" ADD CONSTRAINT "user_workspace_blocks_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "user_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_workspace_tasks" ADD CONSTRAINT "user_workspace_tasks_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "user_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_workspace_tasks" ADD CONSTRAINT "user_workspace_tasks_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tables" ADD CONSTRAINT "user_tables_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "user_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_table_columns" ADD CONSTRAINT "user_table_columns_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "user_tables"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_table_cells" ADD CONSTRAINT "user_table_cells_column_id_fkey" FOREIGN KEY ("column_id") REFERENCES "user_table_columns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
