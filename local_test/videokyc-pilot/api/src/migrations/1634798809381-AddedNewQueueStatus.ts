import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedNewQueueStatus1634798809381 implements MigrationInterface {
    name = 'AddedNewQueueStatus1634798809381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" ALTER COLUMN "registeredOn" SET DEFAULT '"2021-10-21T06:46:51.372Z"'`);
        await queryRunner.query(`ALTER TYPE "kyc_session_queue_queuestatus_enum" RENAME TO "kyc_session_queue_queuestatus_enum_old"`);
        await queryRunner.query(`CREATE TYPE "kyc_session_queue_queuestatus_enum" AS ENUM('0', '1', '2', '3', '4', '5')`);
        await queryRunner.query(`ALTER TABLE "kyc_session_queue" ALTER COLUMN "queueStatus" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "kyc_session_queue" ALTER COLUMN "queueStatus" TYPE "kyc_session_queue_queuestatus_enum" USING "queueStatus"::"text"::"kyc_session_queue_queuestatus_enum"`);
        await queryRunner.query(`ALTER TABLE "kyc_session_queue" ALTER COLUMN "queueStatus" SET DEFAULT '0'`);
        await queryRunner.query(`DROP TYPE "kyc_session_queue_queuestatus_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "kyc_session_queue_queuestatus_enum_old" AS ENUM('0', '1', '2', '3', '4')`);
        await queryRunner.query(`ALTER TABLE "kyc_session_queue" ALTER COLUMN "queueStatus" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "kyc_session_queue" ALTER COLUMN "queueStatus" TYPE "kyc_session_queue_queuestatus_enum_old" USING "queueStatus"::"text"::"kyc_session_queue_queuestatus_enum_old"`);
        await queryRunner.query(`ALTER TABLE "kyc_session_queue" ALTER COLUMN "queueStatus" SET DEFAULT '0'`);
        await queryRunner.query(`DROP TYPE "kyc_session_queue_queuestatus_enum"`);
        await queryRunner.query(`ALTER TYPE "kyc_session_queue_queuestatus_enum_old" RENAME TO "kyc_session_queue_queuestatus_enum"`);
        await queryRunner.query(`ALTER TABLE "customer" ALTER COLUMN "registeredOn" SET DEFAULT '2021-08-09 11:45:22.547'`);
    }

}
