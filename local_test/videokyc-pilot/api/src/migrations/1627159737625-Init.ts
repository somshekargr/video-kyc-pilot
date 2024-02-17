import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1627159737625 implements MigrationInterface {
    name = 'Init1627159737625'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "customer_kycstatus_enum" AS ENUM('0', '1', '2', '3', '4', '5')`);
        await queryRunner.query(`CREATE TABLE "customer" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "panNumber" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "photo" character varying, "careof" character varying, "dob" TIMESTAMP, "villageTownCity" character varying, "aadharName" character varying, "country" character varying, "street" character varying, "state" character varying, "post" character varying, "pincode" character varying, "location" character varying, "landmark" character varying, "house" character varying, "district" character varying, "subDistrict" character varying, "kycStatus" "customer_kycstatus_enum" NOT NULL DEFAULT '0', CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "kyc_session_queue_queuestatus_enum" AS ENUM('0', '1', '2', '3', '4')`);
        await queryRunner.query(`CREATE TABLE "kyc_session_queue" ("id" SERIAL NOT NULL, "customerId" integer NOT NULL, "agentId" integer, "queuedTs" TIMESTAMP, "customerConnectedTs" TIMESTAMP, "agentConnectedTs" TIMESTAMP, "completedTs" TIMESTAMP, "exitTs" TIMESTAMP, "sessionId" character varying, "agentPId" character varying, "customerPID" character varying, "queueStatus" "kyc_session_queue_queuestatus_enum" NOT NULL DEFAULT '0', CONSTRAINT "PK_425bab9cbc903cc5b1e1582710a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "user_userrole_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "name" character varying NOT NULL, "mobileNo" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "userRole" "user_userrole_enum" NOT NULL DEFAULT '0', "userType" character varying NOT NULL, "isActive" boolean DEFAULT true, "createdOn" TIMESTAMP WITH TIME ZONE DEFAULT now(), "createdBy" bigint, "updatedOn" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedBy" bigint, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "user_userrole_enum"`);
        await queryRunner.query(`DROP TABLE "kyc_session_queue"`);
        await queryRunner.query(`DROP TYPE "kyc_session_queue_queuestatus_enum"`);
        await queryRunner.query(`DROP TABLE "customer"`);
        await queryRunner.query(`DROP TYPE "customer_kycstatus_enum"`);
    }

}
