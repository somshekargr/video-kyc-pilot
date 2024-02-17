import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatedCustomerTable1628509519594 implements MigrationInterface {
    name = 'UpdatedCustomerTable1628509519594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" ADD "consentAccepted" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "customer" ALTER COLUMN "registeredOn" SET DEFAULT '"2021-08-09T11:45:22.547Z"'`);
        await queryRunner.query(`ALTER TYPE "customer_kycstatus_enum" RENAME TO "customer_kycstatus_enum_old"`);
        await queryRunner.query(`CREATE TYPE "customer_kycstatus_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`ALTER TABLE "customer" ALTER COLUMN "kycStatus" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "customer" ALTER COLUMN "kycStatus" TYPE "customer_kycstatus_enum" USING "kycStatus"::"text"::"customer_kycstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "customer" ALTER COLUMN "kycStatus" SET DEFAULT '0'`);
        await queryRunner.query(`DROP TYPE "customer_kycstatus_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "customer_kycstatus_enum_old" AS ENUM('0', '1', '2', '3', '4', '5')`);
        await queryRunner.query(`ALTER TABLE "customer" ALTER COLUMN "kycStatus" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "customer" ALTER COLUMN "kycStatus" TYPE "customer_kycstatus_enum_old" USING "kycStatus"::"text"::"customer_kycstatus_enum_old"`);
        await queryRunner.query(`ALTER TABLE "customer" ALTER COLUMN "kycStatus" SET DEFAULT '0'`);
        await queryRunner.query(`DROP TYPE "customer_kycstatus_enum"`);
        await queryRunner.query(`ALTER TYPE "customer_kycstatus_enum_old" RENAME TO "customer_kycstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "customer" ALTER COLUMN "registeredOn" SET DEFAULT '2021-08-05 18:56:36.728'`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "consentAccepted"`);
    }

}
