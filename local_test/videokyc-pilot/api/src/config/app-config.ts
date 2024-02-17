import { JwtModuleOptions } from "@nestjs/jwt";
import { MongooseModuleOptions } from "@nestjs/mongoose";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as dotenv from 'dotenv';
import { Customer } from "src/entity/customer.entity";
import { KYCSessionQueue } from "src/entity/kyc-session-queue.entity";
import { User } from "src/entity/user.entity";

const entities = [Customer, User, KYCSessionQueue];

const result = dotenv.config({});

if (result.error) {
    console.error('Reading .env file failed!');
}

export interface MongoDbConfig {
    url: string;
    options: MongooseModuleOptions;
}

export interface EmailConfig {
    enabled: boolean;
    defaults: {
        from: string;
    },
    sendGridApiKey: string
}

export interface SmsConfig {
}

export interface CallRecordingConfig {
    storagePath: string;
}

export interface AadharXmlUploadConfig {
    rejectAadharXmlOlderThanDays: number;
}

export interface AppConfig {
    applicationAPIEndPointPort?: number;
    applicationUIEndPointUrl?: string;
    applicationBaseUrl?: string;
    webHookBaseUrl?: string;
    videofloBaseUrl?: string;
    videofloAppId?: string;
    videofloSecretKey?: string;
    jwtConfig: JwtModuleOptions;
    mongoDbConfig: MongoDbConfig;
    postgresqlDbConfig: TypeOrmModuleOptions;
    emailConfig: EmailConfig;
    smsConfig: SmsConfig;
    callRecording: CallRecordingConfig;
    aadharXmlUploadConfig: AadharXmlUploadConfig;
}

export const appConfig: AppConfig = {
    applicationAPIEndPointPort: process.env.APPLICATION_API_END_POINT_PORT ? parseInt(process.env.APPLICATION_API_END_POINT_PORT) : undefined,
    applicationUIEndPointUrl: process.env.APPLICATION_UI_END_POINT_URL ? process.env.APPLICATION_UI_END_POINT_URL : undefined,
    applicationBaseUrl: process.env.APPLICATION_BASE_URL,
    webHookBaseUrl: process.env.WEBHOOK_BASE_URL,
    videofloBaseUrl: process.env.VIDEOFLO_BASE_URL,
    videofloAppId: process.env.VIDEOFLO_APP_ID,
    videofloSecretKey: process.env.VIDEOFLO_SECRET_KEY,
    jwtConfig: {
        secret: process.env.JWT_SECRET_KEY,
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN }
    },
    mongoDbConfig: {
        url: process.env.MONGO_DB_URL,
        options: {}
    },
    postgresqlDbConfig: {
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
        entities: entities,
        synchronize: false,
        migrationsRun: false
    },
    emailConfig: {
        enabled: process.env.EMAIL_ENABLED.toLowerCase() === 'true' ? true : false,
        defaults: {
            from: process.env.EMAIL_FROM,
        },
        sendGridApiKey: process.env.SEND_GRID_EMAIL_API_KEY
    },
    smsConfig: {
    },
    callRecording: {
        storagePath: process.env.CALL_RECORDING_STORAGE_PATH
    },
    aadharXmlUploadConfig: {
        rejectAadharXmlOlderThanDays: process.env.REJECT_AADHAR_OLDER_THAN_DAYS ? parseInt(process.env.REJECT_AADHAR_OLDER_THAN_DAYS) : 3
    }
};
