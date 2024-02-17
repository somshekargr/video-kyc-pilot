import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatedCustomerTable1628189794660 implements MigrationInterface {
    name = 'UpdatedCustomerTable1628189794660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" ADD "registeredOn" TIMESTAMP NOT NULL DEFAULT '"2021-08-05T18:56:36.728Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "registeredOn"`);
    }

}
