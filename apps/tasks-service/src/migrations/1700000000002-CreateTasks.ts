import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTasks1700000000002 implements MigrationInterface {
  name = 'CreateTasks1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tasks_priority_enum') THEN
          CREATE TYPE tasks_priority_enum AS ENUM ('LOW','MEDIUM','HIGH','URGENT');
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tasks_status_enum') THEN
          CREATE TYPE tasks_status_enum AS ENUM ('TODO','IN_PROGRESS','REVIEW','DONE');
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "tasks" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "title" varchar(200) NOT NULL,
        "description" text,
        "due_date" TIMESTAMP NULL,
        "priority" tasks_priority_enum NOT NULL DEFAULT 'MEDIUM',
        "status" tasks_status_enum NOT NULL DEFAULT 'TODO',
        "assignees" text[] NOT NULL DEFAULT '{}',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "task_comments" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "task_id" uuid NOT NULL,
        "author_id" uuid NOT NULL,
        "content" text NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT fk_task_comments_task FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "task_history" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "task_id" uuid NOT NULL,
        "action" varchar(50) NOT NULL,
        "payload" jsonb,
        "actor_id" uuid,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT fk_task_history_task FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "task_history"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "task_comments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tasks"`);
    await queryRunner.query(`DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tasks_status_enum') THEN DROP TYPE tasks_status_enum; END IF; END $$;`);
    await queryRunner.query(`DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tasks_priority_enum') THEN DROP TYPE tasks_priority_enum; END IF; END $$;`);
  }
}
