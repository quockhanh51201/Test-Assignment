import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1778850220694 implements MigrationInterface {
    name = 'InitialSchema1778850220694'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_credits" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "current_credits" integer NOT NULL DEFAULT '0', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "REL_e517bd2a3be00563896952bcd3" UNIQUE ("user_id"), CONSTRAINT "PK_02811227c8934f2daee2b018bb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "features" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "name" character varying NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c0e1f5d0ba8027c186705d752b8" UNIQUE ("code"), CONSTRAINT "PK_5c1e336df2f4a7051e5bf08a941" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_features" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "unlocked_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "feature_id" uuid, CONSTRAINT "PK_167060a0a5cbfe009f74a4b1fb6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4944ba05594ab50ad181de58f3" ON "user_features" ("user_id", "feature_id") `);
        await queryRunner.query(`CREATE TABLE "packages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "price" numeric(10,2) NOT NULL, "credits" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_020801f620e21f943ead9311c98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_status_enum" AS ENUM('pending', 'success', 'failed')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(10,2) NOT NULL, "status" "public"."transactions_status_enum" NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "package_id" uuid, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "package_features" ("package_id" uuid NOT NULL, "feature_id" uuid NOT NULL, CONSTRAINT "PK_013ea50586644d5fc6d8545b6fc" PRIMARY KEY ("package_id", "feature_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a9aa1a282cb68ee4119db97b6b" ON "package_features" ("package_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_70b48c42843c2b9948ffa8852d" ON "package_features" ("feature_id") `);
        await queryRunner.query(`ALTER TABLE "user_credits" ADD CONSTRAINT "FK_e517bd2a3be00563896952bcd38" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_features" ADD CONSTRAINT "FK_93ba05009b2885ad70d531958d3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_features" ADD CONSTRAINT "FK_425a9588c92b262a12d58bde45b" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_5cb6f8c4da5f564147aef20f0bf" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "package_features" ADD CONSTRAINT "FK_a9aa1a282cb68ee4119db97b6bb" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "package_features" ADD CONSTRAINT "FK_70b48c42843c2b9948ffa8852d7" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "package_features" DROP CONSTRAINT "FK_70b48c42843c2b9948ffa8852d7"`);
        await queryRunner.query(`ALTER TABLE "package_features" DROP CONSTRAINT "FK_a9aa1a282cb68ee4119db97b6bb"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_5cb6f8c4da5f564147aef20f0bf"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b"`);
        await queryRunner.query(`ALTER TABLE "user_features" DROP CONSTRAINT "FK_425a9588c92b262a12d58bde45b"`);
        await queryRunner.query(`ALTER TABLE "user_features" DROP CONSTRAINT "FK_93ba05009b2885ad70d531958d3"`);
        await queryRunner.query(`ALTER TABLE "user_credits" DROP CONSTRAINT "FK_e517bd2a3be00563896952bcd38"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_70b48c42843c2b9948ffa8852d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a9aa1a282cb68ee4119db97b6b"`);
        await queryRunner.query(`DROP TABLE "package_features"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
        await queryRunner.query(`DROP TABLE "packages"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4944ba05594ab50ad181de58f3"`);
        await queryRunner.query(`DROP TABLE "user_features"`);
        await queryRunner.query(`DROP TABLE "features"`);
        await queryRunner.query(`DROP TABLE "user_credits"`);
    }

}
