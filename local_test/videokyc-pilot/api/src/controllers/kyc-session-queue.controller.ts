import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { appConfig } from 'src/config/app-config';
import { EmailSubjects, EmailTemplateName } from 'src/dto/app.constants';
import { AuditDTO } from 'src/dto/audit.dto';
import { VideofloSessionDTO } from 'src/dto/videoflo-session.dto';
import { MailInfo } from 'src/mail/mail-info';
import { MailService } from 'src/mail/mail.service';
import { PDFUtilService } from 'src/pdf/pdf-util.service';
import { CustomerService } from 'src/services/customer.service';
import { AgentJoinLinkInfo } from '../dto/agent-join-info';
import { CreateSessionInfo } from '../dto/create-session.dto';
import { CustomerJoinLinkInfo } from '../dto/customer-join-info';
import { QueuedCustomerAgentDTO } from '../dto/queued-customer-agent.dto';
import { SessionInfo } from '../dto/session-info.dto';
import { VideoFloAccessTokenDTO } from '../dto/videoflo-access-token.dto';
import { KYCSessionQueueService } from '../services/kyc-session-queue.service';
const dateFormat = require('dateformat');

@Controller('kycSessionQueue')
@ApiTags('kycSessionQueue')
export class KYCSessionQueueController {

    constructor(
        private kycSessionQueueService: KYCSessionQueueService,
        private customerService: CustomerService,
        private pdfService: PDFUtilService,
        private mailService: MailService
    ) { }

    @Get('getActiveSessions')
    @ApiOperation({ operationId: 'getActiveSessions' })
    @ApiBadRequestResponse()
    @ApiOkResponse({
        type: [QueuedCustomerAgentDTO],
    })
    async getActiveSessions(): Promise<QueuedCustomerAgentDTO[]> {
        let activeSessions = await this.kycSessionQueueService.getActiveSessions();
        return activeSessions;
    }

    @Get('getQueuedCustomerAgentDTO/:queueId')
    @ApiOperation({ operationId: 'getQueuedCustomerAgentDTO' })
    @ApiBadRequestResponse()
    @ApiOkResponse({
        type: QueuedCustomerAgentDTO,
    })
    async getQueuedCustomerAgentDTO(@Param('queueId') queueId: number): Promise<QueuedCustomerAgentDTO> {
        let activeSessions = await this.kycSessionQueueService.getQueuedCustomerAgentDTO(queueId);
        return activeSessions;
    }

    @Get('getCallCompletedSessions')
    @ApiOperation({ operationId: 'getCallCompletedSessions' })
    @ApiBadRequestResponse()
    @ApiOkResponse({
        type: [QueuedCustomerAgentDTO],
    })
    async getCallCompletedSessions(): Promise<QueuedCustomerAgentDTO[]> {
        let activeSessions = await this.kycSessionQueueService.getCallCompletedSessions();
        return activeSessions;
    }

    @Get('getSessionById/:queueId')
    @ApiOperation({ operationId: 'getSessionById' })
    @ApiBadRequestResponse()
    @ApiOkResponse({
        type: VideofloSessionDTO,
    })
    async getSessionById(@Param('queueId') queueId: number): Promise<VideofloSessionDTO> {
        let sessionData = await this.kycSessionQueueService.getAuditDataBySession(queueId);
        return sessionData;
    }


    @Get('getAgentJoinLink/:queueId')
    @ApiOperation({ operationId: 'getAgentJoinLink' })
    @ApiBadRequestResponse()
    @ApiOkResponse({
        type: AgentJoinLinkInfo
    })
    async getAgentJoinLink(@Param('queueId') queueId: number): Promise<AgentJoinLinkInfo> {
        let joinLinkInfo = await this.kycSessionQueueService.getAgentJoinLinkInfo(queueId);
        return joinLinkInfo;
    }

    @Get('getCustomerJoinLink/:queueId')
    @ApiOperation({ operationId: 'getCustomerJoinLink' })
    @ApiBadRequestResponse()
    @ApiOkResponse({
        type: CustomerJoinLinkInfo
    })
    async getCustomerJoinLink(@Param('queueId') queueId: number): Promise<CustomerJoinLinkInfo> {
        let joinLinkInfo = await this.kycSessionQueueService.getCustomerJoinLinkInfo(queueId);
        return joinLinkInfo;
    }

    @Get('isValidSession/:queueId')
    @ApiOperation({ operationId: 'isValidSession' })
    @ApiBadRequestResponse()
    @ApiOkResponse({
        type: Boolean
    })
    async isValidSession(@Param('queueId') queueId: number): Promise<boolean> {
        let isValidSession = await this.kycSessionQueueService.isValidSession(queueId);
        return isValidSession;
    }

    @Post('createSession')
    @ApiOperation({ operationId: 'createSession' })
    @ApiBadRequestResponse()
    @ApiOkResponse({
        type: Boolean
    })
    async createSession(@Body() sessionInfo: CreateSessionInfo): Promise<boolean> {
        let isSuccess = await this.kycSessionQueueService.createSession(sessionInfo.queueId);
        return isSuccess;
    }

    @Post('updateQueueStateOnAgentConnected')
    @ApiOperation({ operationId: 'updateQueueStateOnAgentConnected' })
    @ApiBadRequestResponse()
    @ApiOkResponse({
        type: QueuedCustomerAgentDTO
    })
    async updateQueueStateOnAgentConnected(@Body() sessionInfo: SessionInfo): Promise<QueuedCustomerAgentDTO> {
        await this.kycSessionQueueService.updateQueueStateOnAgentConnected(sessionInfo.queueId);
        let dto: QueuedCustomerAgentDTO = await this.kycSessionQueueService.getQueuedCustomerAgentDTO(sessionInfo.queueId);
        return dto;
    }

    @Post('updateQueueStateOnCustomerConnected')
    @ApiOperation({ operationId: 'updateQueueStateOnCustomerConnected' })
    @ApiBadRequestResponse()
    @ApiOkResponse({
        type: QueuedCustomerAgentDTO
    })
    async updateQueueStateOnCustomerConnected(@Body() sessionInfo: SessionInfo): Promise<QueuedCustomerAgentDTO> {
        await this.kycSessionQueueService.updateQueueStateOnCustomerConnected(sessionInfo.queueId);
        let dto: QueuedCustomerAgentDTO = await this.kycSessionQueueService.getQueuedCustomerAgentDTO(sessionInfo.queueId);
        return dto;
    }

    @Post('updateQueueStateOnCallCompleted')
    @ApiOperation({ operationId: 'updateQueueStateOnCallCompleted' })
    @ApiBadRequestResponse()
    @ApiOkResponse({
        type: QueuedCustomerAgentDTO
    })
    async updateQueueStateOnCallCompleted(@Body() sessionInfo: SessionInfo): Promise<QueuedCustomerAgentDTO> {
        await this.kycSessionQueueService.updateQueueStateOnCustomerConnected(sessionInfo.queueId);
        let dto: QueuedCustomerAgentDTO = await this.kycSessionQueueService.getQueuedCustomerAgentDTO(sessionInfo.queueId);
        return dto;
    }

    @Post('getVideofloAccessToken')
    @ApiOperation({ operationId: 'getVideofloAccessToken' })
    @ApiBadRequestResponse()
    @ApiOkResponse({
        type: VideoFloAccessTokenDTO
    })
    async getVideofloAccessToken(): Promise<VideoFloAccessTokenDTO> {
        let token = await this.kycSessionQueueService.getVideofloAccessToken();
        return token;
    }


    @Post('updateAudit')
    @ApiOperation({ operationId: 'updateAudit' })
    @ApiBadRequestResponse()
    @ApiOkResponse({
        type: Boolean
    })
    async updateAudit(@Body() auditInfo: AuditDTO): Promise<boolean> {
        let result = await this.kycSessionQueueService.updateAudit(auditInfo);

        if (result != null) {
            let queue = await this.kycSessionQueueService.findOne(auditInfo.queueId);
            let customer = await this.customerService.findOne(queue.customerId);

            if (appConfig.emailConfig.enabled) {
                if (auditInfo.isAccepted) {
                    //Sending the email upon the KYC Accepted by the Agent
                    await this.sendKYCAcceptedEmail(customer.email, result.auditedOn);
                } else {
                    //Sending the email upon the KYC Accepted by the Agent
                    await this.sendKYCRejectedEmail(customer.email, result.auditedOn);
                }
            }
            return true;
        }
        return false;
    }

    private async sendKYCAcceptedEmail(toEmail: string, timestamp: Date) {
        let maininfo: MailInfo = {
            subject: EmailSubjects.customerKycAcceptedSubject,
            teamplateContext: {
                timestamp: dateFormat(timestamp, "dd-mm-yyyy h:MM TT")
            },
            templateName: EmailTemplateName.customerKycAcceptedTemplate,
            to: toEmail
        };

        await this.mailService.sendEmail(maininfo);
    }

    private async sendKYCRejectedEmail(toEmail: string, timestamp: Date) {
        let maininfo: MailInfo = {
            subject: EmailSubjects.customerKycRejectedSubject,
            teamplateContext: {
                timestamp: dateFormat(timestamp, "dd-mm-yyyy h:MM TT")
            },
            templateName: EmailTemplateName.customerKycRejectedTemplate,
            to: toEmail
        };

        await this.mailService.sendEmail(maininfo);
    }


    @Post('testMethod')
    @ApiOperation({ operationId: 'testMethod' })
    @ApiBadRequestResponse()
    @ApiOkResponse({
        type: Boolean
    })
    async testMethod(): Promise<boolean> {

        let contentBuffer = await this.pdfService.generatePDFToFile();

        let maininfo: MailInfo = {
            subject: "Welcome to VideoKYC",
            teamplateContext: {
                name: "testname", url: "https://vkyc-pilot.videoflo.net/customer"
            },
            templateName: EmailTemplateName.customerKycJoinTemplate,
            to: "somshekargr@gmail.com",
            attachments: [{
                filename: 'test.pdf',
                contentType: 'application/pdf',
                content: contentBuffer
            }]
        };

        // Sending Email to Customer, if Email is enabled
        if (appConfig.emailConfig.enabled) {
            await this.mailService.sendEmail(maininfo);
        }

        return false;
    }
}