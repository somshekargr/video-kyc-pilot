import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { QueuedCustomerAgentDto } from '../api/models';
import { AuditDto } from '../api/models/audit-dto';
import { KycSessionQueueService } from '../api/services';
import { AuthenticationService } from '../services/authentication.service';
import { TokenService } from '../services/token.service';
import { KYCStatus } from '../types/kyc-status';

@Component({
  selector: 'app-view-audit',
  templateUrl: './view-audit.component.html',
  styles: ['.fh{height:100%}']
})
export class ViewAuditComponent implements OnInit, OnDestroy {

  apiBaseUrl = "";
  public rejectionReason: string = "";
  public showAcceptKycPopup: boolean = false;
  public showRejectKycPopup: boolean = false;
  public address: string;
  public sessionData: any = null;

  public dto: QueuedCustomerAgentDto = null;

  public queueId: number;

  paramMapSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private messageSerice: MessageService,
    private authenticationService: AuthenticationService,
    private tokenService: TokenService,
    private sessionQueueService: KycSessionQueueService
  ) {
    console.log('ngonint');
  }

  ngOnDestroy(): void {
    if (this.paramMapSubscription) {
      this.paramMapSubscription.unsubscribe();
      this.paramMapSubscription = null;
    }
  }

  async ngOnInit(): Promise<void> {
    console.log('ngonint');
    //Getting the route params
    this.paramMapSubscription = this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.queueId = +params.get('id');
      await this.getSessonData();
    });
  }

  getCallRecordingUrl() {
    const url = `${environment.apiURL}/api/VideoKycWebhook/callRecording/${this.dto.queueInfo.sessionId}`;
    return url;
  }

  //TODO
  isRecordingAvailable() {
    this.dto.queueInfo.rejectReason
    return this.dto.queueInfo.callRecordingVideoPath != null;
  }

  async getSessonData() {
    this.sessionData = await this.sessionQueueService.getSessionById({ queueId: this.queueId }).toPromise();
    console.log(this.sessionData);

    this.dto = await this.sessionQueueService.getQueuedCustomerAgentDto({ queueId: this.queueId }).toPromise();
    console.log(this.dto);

    let addressInfo = this.dto.customerInfo.addressInfo;
    this.address = `${this.dto.customerInfo.name} ${this.dto.customerInfo.careof} ${addressInfo.street} ${addressInfo.villageTownCity}
    ${addressInfo.subDistrict} ${addressInfo.district} ${addressInfo.post} ${addressInfo.state} `;
  }


  hasActivity(activityName: string) {
    return this.sessionData.data.hasOwnProperty(activityName);
  }

  getAgentDataByActivity(activityName: string) {
    if (this.dto)
      return this.sessionData.data[activityName][this.dto.queueInfo.customerPID];

    return null
  }

  public get KycStatus(): typeof KYCStatus {
    return KYCStatus;
  }


  KYC() {
    let statusDetail = { status: '', css: '' };
    switch (this.dto.customerInfo.kycStatus) {
      case KYCStatus.notStarted:
        statusDetail.status = "Not Started";
        statusDetail.css = "text-primary";
        break;
      case KYCStatus.scheduled:
        statusDetail.status = "Schedulded";
        statusDetail.css = "text-primary";
        break;
      case KYCStatus.inProgress:
        statusDetail.status = "Inprogress";
        statusDetail.css = "text-primary";
        break;
      case KYCStatus.toBeAudited:
        statusDetail.status = "To be Audited";
        statusDetail.css = "text-primary";
        break;
      case KYCStatus.accepted:
        statusDetail.status = "Accepted"
        statusDetail.css = "text-primary";
        break;
      case KYCStatus.rejected:
        statusDetail.status = "Rejected"
        statusDetail.css = "text-danger";
        break;
      case KYCStatus.agentRejected:
        statusDetail.status = "Agent Rejected"
        statusDetail.css = "text-danger";
        break;
      default:
    }

    return statusDetail;
  }

  get faceRecognitionResult() {
    return this.getAgentDataByActivity('faceRecognition').payload;
  }

  get panCaptureResult() {
    return this.getAgentDataByActivity('panCapture').payload;
  }

  get customerSignatureResult() {
    return this.getAgentDataByActivity('customerSignature').payload;
  }

  confirmAcceptKYC() {
    this.showAcceptKycPopup = true;
  }

  confirmRejectKYC() {
    this.showRejectKycPopup = true;
  }

  async updateAudit(isAccepted: boolean) {
    if (!isAccepted) {
      if (this.rejectionReason.trim().length <= 0)
        return;
    }

    this.showRejectKycPopup = false;
    this.showAcceptKycPopup = false;

    var currentUser = this.tokenService.decodeAsUserDto(this.authenticationService.currentUserValue.token);
    let auditInfo: AuditDto = {
      sessionId: this.dto.queueInfo.sessionId,
      auditedBy: currentUser.id,
      isAccepted: isAccepted,
      queueId: this.dto.queueInfo.id,
      rejectReason: this.rejectionReason.length == 0 ? null : this.rejectionReason
    }
    let success = await this.sessionQueueService.updateAudit({ body: auditInfo }).toPromise();
    if (success) {
      this.messageSerice.add({ severity: 'success', summary: 'Success', detail: 'Audit datails updated successfully' });
    } else {
      this.messageSerice.add({ severity: 'error', summary: 'Failed', detail: 'Failed to update the audit details!' });
    }
    await this.getSessonData();
  }
}
