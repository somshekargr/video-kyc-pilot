import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatedKYCSessionQueue1627584441817 implements MigrationInterface {
    name = 'UpdatedKYCSessionQueue1627584441817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kyc_session_queue" ADD "callRecordingVideoPath" character varying`);
        await queryRunner.query(`ALTER TABLE "kyc_session_queue" ADD "rejectReason" character varying`);
        await queryRunner.query(`ALTER TABLE "kyc_session_queue" ADD "auditedBy" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kyc_session_queue" DROP COLUMN "auditedBy"`);
        await queryRunner.query(`ALTER TABLE "kyc_session_queue" DROP COLUMN "rejectReason"`);
        await queryRunner.query(`ALTER TABLE "kyc_session_queue" DROP COLUMN "callRecordingVideoPath"`);
    }

}
