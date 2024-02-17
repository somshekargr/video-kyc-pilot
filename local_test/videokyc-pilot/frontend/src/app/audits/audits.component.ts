import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { QueuedCustomerAgentDto } from '../api/models';
import { KycSessionQueueService } from '../api/services';
import { QueueStatus } from '../models/queue-status';
import { KYCStatus } from '../types/kyc-status';
import { AppUtils } from '../utils/app-utils';

@Component({
  selector: 'app-audits',
  templateUrl: './audits.component.html'
})
export class AuditsComponent implements OnInit {
  public callCompletedSessions: QueuedCustomerAgentDto[] = [];
  constructor(
    private router: Router,
    private sessionQueueService: KycSessionQueueService,
    private messageService: MessageService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadCallCompletedSessions();
  }

  async loadCallCompletedSessions(isRefresh: boolean = false): Promise<void> {
    this.callCompletedSessions = await this.sessionQueueService.getCallCompletedSessions().toPromise();
    
    if (isRefresh)
      this.messageService.add({ severity: 'success', summary: 'Data Refreshed', detail: 'Audit Logs refreshed successfully' });
  }

  getSessionDuration(session: QueuedCustomerAgentDto) {
    if (session.queueInfo.customerConnectedTs == null || session.queueInfo.completedTs == null) {
      return "N/A"
    }
    const difference = AppUtils.dateDiff(new Date(session.queueInfo.customerConnectedTs), new Date(session.queueInfo.completedTs));
    let formatedText = '';
    const keys = ['years', 'months', 'days', 'hours'];

    for (const k of keys) {
      if (difference[k] > 0) {
        formatedText += difference[k] + ' ' + k + ', ';
      }
    }

    formatedText += difference.minutes + ' mins and ' + difference.seconds + ' sec.';

    return formatedText;
  }

  viewAudit(session: QueuedCustomerAgentDto) {
    let url = `/view-audits/${session.queueInfo.id}`
    this.router.navigateByUrl(url);
  }

  getQueueStatus(status: any): string {
    return QueueStatus[status].toString();
  }

  getKycStatus(status: any): string {
    return KYCStatus[status].toString();
  }

  public get QueueStatus(): typeof QueueStatus {
    return QueueStatus;
  }
}
