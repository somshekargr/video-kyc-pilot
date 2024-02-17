import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatedAuditColumns1627647256332 implements MigrationInterface {
    name = 'UpdatedAuditColumns1627647256332'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kyc_session_queue" ADD "auditedOn" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kyc_session_queue" DROP COLUMN "auditedOn"`);
    }

}
