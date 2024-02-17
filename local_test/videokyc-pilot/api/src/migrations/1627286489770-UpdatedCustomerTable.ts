import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatedCustomerTable1627286489770 implements MigrationInterface {
    name = 'UpdatedCustomerTable1627286489770'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" ALTER COLUMN "email" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" ALTER COLUMN "email" SET NOT NULL`);
    }

}
