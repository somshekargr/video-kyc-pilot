import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PDFModule } from '@t00nday/nestjs-pdf';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { appConfig } from './config/app-config';
import { ApplicationGateway } from './controllers/application.gateway';
import { CustomerController } from './controllers/customer.controller';
import { KYCSessionQueueController } from './controllers/kyc-session-queue.controller';
import { UserController } from './controllers/user.controller';
import { VideoKycWebhookController } from './controllers/videokyc-webhooks.controller';
import { Customer } from './entity/customer.entity';
import { KYCSessionQueue } from './entity/kyc-session-queue.entity';
import { User } from './entity/user.entity';
import { PDFUtilService } from './pdf/pdf-util.service';
import { VideofloSessionSchema, VideofloSessionsCollection } from './schemas/videoflo-session';
import { CustomerService } from './services/customer.service';
import { KYCSessionQueueService } from './services/kyc-session-queue.service';
import { MessageClientService } from './services/message.service';
import { OfflineAadharXmlService } from './services/offline-aadhar-xml.service';
import { UsersService } from './services/users.service';
import { VideoKycClientService } from './services/video-kyc-client.service';
import { join } from 'path';
import { MailService } from './mail/mail.service';
import { readFileSync } from 'fs';
const entities = [Customer, User, KYCSessionQueue];
console.log(__dirname);

// let pdfModuleCssContents = readFileSync('./assets/pdf-templates/vkyc-summary/css/all.min.css')?.toString();

let pdfModuleCssContents = readFileSync('./assets/pdf-templates/vkyc-summary/css/test.css')?.toString();

pdfModuleCssContents += readFileSync('./assets/pdf-templates/vkyc-summary/css/template-styles.css')?.toString();

@Module({
  imports: [
    HttpModule,
    PassportModule,
    TypeOrmModule.forRoot(appConfig.postgresqlDbConfig),
    TypeOrmModule.forFeature(entities),
    MongooseModule.forRoot(appConfig.mongoDbConfig.url, appConfig.mongoDbConfig.options),
    MongooseModule.forFeature([
      { name: VideofloSessionsCollection, schema: VideofloSessionSchema }
    ]),
    JwtModule.register(appConfig.jwtConfig),
    PDFModule.register({
      isGlobal: true,
      view: {
        root: join(__dirname, 'assets/pdf-templates'),
        engine: 'handlebars'
      },
      juice: {
        extraCss: pdfModuleCssContents
      }
    })
  ],
  controllers: [
    CustomerController,
    UserController,
    KYCSessionQueueController,
    VideoKycWebhookController
  ],
  providers: [
    MailService,
    UsersService,
    KYCSessionQueueService,
    AuthService,
    JwtStrategy,
    CustomerService,
    ApplicationGateway,
    VideoKycClientService,
    MessageClientService,
    OfflineAadharXmlService,
    PDFUtilService
  ]
})
export class AppModule { }
