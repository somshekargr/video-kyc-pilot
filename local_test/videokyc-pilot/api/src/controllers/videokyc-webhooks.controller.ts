import { Body, Controller, Get, Param, Post, Req, Res, Request } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream, statSync } from 'fs';
import * as mime from 'mime-types';
import { appConfig } from 'src/config/app-config';
import { EmailSubjects, EmailTemplateName, ParticipantConnectionState, ParticipantRoleType } from 'src/dto/app.constants';
import { DownloadCallRecordingDTO } from 'src/dto/download-call-recording.dto';
import { ParticipantConnectionStatusModel } from 'src/dto/participant-connection-status.model';
import { KYCStatus } from 'src/entity/customer.entity';
import { MailInfo } from 'src/mail/mail-info';
import { MailService } from 'src/mail/mail.service';
import { CustomerService } from 'src/services/customer.service';
import { VideoKycClientService } from 'src/services/video-kyc-client.service';
import { NewMessageRequest } from '../dto/new-message-request';
import { KYCSessionQueueService } from '../services/kyc-session-queue.service';
import { MessageClientService } from '../services/message.service';
var path = require('path');
const fs = require("fs");
const dateFormat = require('dateformat');

@Controller('VideoKycWebhook')
@ApiTags('VideoKycWebhook')
export class VideoKycWebhookController {

  constructor(
    private kycSessionQueueService: KYCSessionQueueService,
    private customerService: CustomerService,
    private messageClientService: MessageClientService,
    private videoKycClientService: VideoKycClientService,
    private mailService: MailService,
  ) { }

  @Post('onParticipantConnected')
  @ApiOperation({ operationId: 'onParticipantConnected' })
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: Boolean
  })
  async onParticipantConnected(@Body() body: any): Promise<boolean> {
    let data = body;
    return true;
  }


  @Post('onParticipantDisconnected')
  @ApiOperation({ operationId: 'onParticipantDisconnected' })
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: Boolean
  })
  async onParticipantDisconnected(@Body() body: any): Promise<boolean> {
    if (!!body) {
      let connectionState = body as ParticipantConnectionStatusModel;
      if (connectionState) {
        if (connectionState.role == ParticipantRoleType.Customer && connectionState.connectionState == ParticipantConnectionState.Disconnected) {
          let queue = await this.kycSessionQueueService.getBySessionId(connectionState.sessionId);
          queue = await this.kycSessionQueueService.updateQueueStateOnCallDisconnected(queue.id);
        }
      }
      return true;
    }
    return false;
  }


  @Post('onWorkflowFinished')
  @ApiOperation({ operationId: 'onWorkflowFinished' })
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: Boolean
  })
  async onWorkflowFinished(@Body() body: any): Promise<boolean> {
    let queue = await this.kycSessionQueueService.getBySessionId(body.sessionId);
    queue = await this.kycSessionQueueService.updateQueueStateOnCallCompleted(queue.id);

    let kycStatus = KYCStatus.toBeAudited;
    if (body.accepted != null && body.accepted == false) {
      kycStatus = KYCStatus.agentRejected;
    }

    await this.customerService.updateKycStatus(queue.customerId, kycStatus);
    await this.kycSessionQueueService.saveVideofloWorkfloData(queue.id, body);

    let customer = await this.customerService.findOne(queue.customerId);

    //Sending the email upon the KYC Call Completion.
    if (appConfig.emailConfig.enabled) {
      await this.sendKYCCompletedEmail(customer.email, queue.completedTs);

      // if (kycStatus = KYCStatus.agentRejected) {
      //   await this.sendKYCRejectedEmail(customer.email, queue.completedTs);
      // }
    }

    return true;
  }

  // private async sendKYCRejectedEmail(toEmail: string, timestamp: Date) {
  //   let maininfo: MailInfo = {
  //     subject: EmailSubjects.customerKycRejectedSubject,
  //     teamplateContext: {
  //       timestamp: dateFormat(timestamp, "dd-mm-yyyy h:MM TT")
  //     },
  //     templateName: EmailTemplateName.customerKycRejectedTemplate,
  //     to: toEmail
  //   };

  //   await this.mailService.sendEmail(maininfo);
  // }

  private async sendKYCCompletedEmail(toEmail: string, completedTIme: Date) {
    let maininfo: MailInfo = {
      subject: EmailSubjects.customerKycCompletedSubject,
      teamplateContext: {
        timestamp: dateFormat(completedTIme, "dd-mm-yyyy h:MM TT")
      },
      templateName: EmailTemplateName.customerKycCompletedTemplate,
      to: toEmail
    };

    await this.mailService.sendEmail(maininfo);
  }

  @Post('onActivityDataGathered')
  @ApiOperation({ operationId: 'onActivityDataGathered' })
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: Boolean
  })
  async onActivityDataGathered(@Body() body: any): Promise<boolean> {
    let data = body;
    return true;
  }

  @Post('onActivityAction')
  @ApiOperation({ operationId: 'onActivityAction' })
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: Boolean
  })
  async onActivityAction(@Body() body: any): Promise<boolean> {
    let data = body;
    return true;
  }


  @Post('onRecordingAvailable')
  @ApiOperation({ operationId: 'onRecordingAvailable' })
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: Boolean
  })
  async onRecordingAvailable(@Body() body: any): Promise<boolean> {
    const sessionId = body.sessionId;
    let storagePath = appConfig.callRecording.storagePath;
    const fileName = `${path.join(storagePath, sessionId)}.mp4`;

    try {
      if (fs.existsSync(storagePath)) {
        // path exists
        await this.videoKycClientService.downloadCallRecording(sessionId, fileName);
        await this.kycSessionQueueService.updateCallRecordingStoragePath(sessionId, fileName);
      } else {
        console.log("DOES NOT exist:", storagePath);
      }
    } catch (error) {
      console.error(`Erorr Occured while downloading the call recording: ${error}`);
    }

    return true;
  }

  @Post('sendMessage')
  @ApiOperation({ operationId: 'sendMessage' })
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: Boolean
  })
  async sendMessage(@Body() body: NewMessageRequest): Promise<void> {
    let messageRequest = new NewMessageRequest({
      message: "test",
      numbers: "917892265321",
    });
    await this.messageClientService.sendMessage(messageRequest);
  }

  @Post('deleteAllEntries')
  @ApiOperation({ operationId: 'deleteAllEntries' })
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: Boolean,
  })
  async deleteAllEntries(): Promise<boolean> {
    return this.kycSessionQueueService.deleteAllEntries();
  }


  @Post('downloadCallRecording')
  @ApiOperation({ operationId: 'downloadCallRecording' })
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: Boolean
  })
  async downloadCallRecording(@Body() body: DownloadCallRecordingDTO): Promise<boolean> {
    await this.videoKycClientService.downloadCallRecording(body.sessionId, body.outputPath);
    return true;
  }

  //@UseGuards(JwtAuthGuard)
  @ApiOperation({ operationId: 'callRecording' })
  @Get('callRecording/:sessionId')
  async callRecording(
    @Param('sessionId') sessionId: string,
    @Req() req: any,
    @Res() res: Response
  ) {

    // TODO: Get the actual file path here
    const filePath = await this.kycSessionQueueService.getCallRecordingPath(sessionId);

    // Cannot get length of file from readStream
    // So we use fs.stat to read the file size before hand
    const { size } = statSync(filePath);

    const range = req.headers.range;

    if (!!range) {
      const maxChunks = 4000000;
      const positions = range.replace(/bytes=/, "").split("-");
      const start = parseInt(positions[0], 10);
      let end = positions[1] ? parseInt(positions[1], 10) : start + maxChunks; //size - 1;

      if (end > size) {
        end = size - 1;
      }

      const chunksize = (end - start) + 1;

      const videoStream = createReadStream(filePath, {
        autoClose: true,
        start: start,
        end: end
      });

      videoStream.on('open', function () {
        res.writeHead(206, {
          "Content-Range": "bytes " + start + "-" + end + "/" + size,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": mime.lookup(filePath)
        });

        // This just pipes the read stream to the response object (which goes 
        //to the client)
        videoStream.pipe(res);
      });

      videoStream.on('error', function (err) {
        res.end(err);
      });
    } else {
      res.writeHead(206, {
        "Content-Length": size,
        "Content-Type": mime.lookup(filePath)
      });

      const videoStream = createReadStream(filePath);
      videoStream.pipe(res);
    }
  }
}
