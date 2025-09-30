import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1759198625171 implements MigrationInterface {
  name = 'InitialSchema1759198625171';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."nodes_type_enum" AS ENUM('USER', 'GROUP')`,
    );

    // Criar a tabela "nodes"
    await queryRunner.query(`
            CREATE TABLE "nodes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "type" "public"."nodes_type_enum" NOT NULL,
                "name" character varying NOT NULL,
                "email" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP DEFAULT now(),
                CONSTRAINT "UQ_b9a5270c5780a58a74b6279f1f0" UNIQUE ("email"),
                CONSTRAINT "PK_b499b986b2450a81d43a6a164e9" PRIMARY KEY ("id")
            )
        `);

    // Criar a tabela "closure"
    await queryRunner.query(`
            CREATE TABLE "closure" (
                "ancestor_id" uuid NOT NULL,
                "descendant_id" uuid NOT NULL,
                "depth" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_98f1f71d7f1d8c5f3b7c8f9f7e5" PRIMARY KEY ("ancestor_id", "descendant_id")
            )
        `);

    // Adicionar a chave estrangeira para o ancestral em "closure"
    await queryRunner.query(`
            ALTER TABLE "closure"
            ADD CONSTRAINT "FK_e88b233e385d8527a2ce08f2f3f"
            FOREIGN KEY ("ancestor_id") REFERENCES "nodes"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

    // Adicionar a chave estrangeira para o descendente em "closure"
    await queryRunner.query(`
            ALTER TABLE "closure"
            ADD CONSTRAINT "FK_8b45f1b89945e43c166d0b601f3"
            FOREIGN KEY ("descendant_id") REFERENCES "nodes"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "closure" DROP CONSTRAINT "FK_8b45f1b89945e43c166d0b601f3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "closure" DROP CONSTRAINT "FK_e88b233e385d8527a2ce08f2f3f"`,
    );
    await queryRunner.query(`DROP TABLE "closure"`);
    await queryRunner.query(`DROP TABLE "nodes"`);
    await queryRunner.query(`DROP TYPE "public"."nodes_type_enum"`);
  }
}
