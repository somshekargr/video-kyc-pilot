import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { WebSocketService } from '../services/websocket.service';
import { PushNotificationsService } from '../utils/push.notification.service';
import { QueueStatus } from '../models/queue-status';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { TokenService } from '../services/token.service';
import { QueuedCustomerAgentDto } from '../api/models';
import { KycSessionQueueService } from '../api/services';
import { NgxSpinnerService } from "ngx-spinner";

declare type Unsubscribable = Subscription | Subject<any>;

@Component({
  selector: 'agent-queue-dashboard',
  styleUrls: ['./queue-board.component.css'],
  templateUrl: './queue-board.component.html'
})

export class AgentQueueBoardComponentent implements OnInit, OnDestroy {
  private subscriptions: Unsubscribable[] = [];
  public activeSessions: QueuedCustomerAgentDto[] = [];
  public QueueStatus: QueueStatus

  public acceptedCallLoadingText: string = "";

  public queuedCustomerAgentDTO: QueuedCustomerAgentDto;

  constructor(
    private router: Router,
    private sessionQueueService: KycSessionQueueService,
    private messageService: MessageService,
    private webSocketService: WebSocketService,
    private pushNotificationService: PushNotificationsService,
    private authenticationService: AuthenticationService,
    private tokenService: TokenService,
    private spinner: NgxSpinnerService
  ) {
    this.pushNotificationService.requestPermission();
  }

  getQueueStatus(status: any): string {
    return QueueStatus[status].toString();
  }

  public get queueStatus(): typeof QueueStatus {
    return QueueStatus;
  }

  async ngOnInit(): Promise<void> {
    this.subscriptions.push(
      this.webSocketService.onCustomerWaiting$.subscribe((payload: QueuedCustomerAgentDto) => {
        //this.notifyAgentOnNewCustomer(payload);
        this.onRefreshKycSessionQueue(payload);
      }),
      this.webSocketService.onRefreshKycSessionQueueWaiting$.subscribe((payload: any) => {
        this.onRefreshKycSessionQueue(payload);
      }),
      this.webSocketService.customerAcceptsCall$.subscribe((payload: QueuedCustomerAgentDto) => {
        this.onRefreshKycSessionQueue(payload);
        const currentUser = this.tokenService.decodeAsUserDto(this.authenticationService.currentUserValue.token);

        //Important, We are binding event of connecting call only for the agent to whom the call is scheduled  with 
        if (currentUser.id == payload.agentInfo.id)
          this.onCustomerConnectsToCall(payload);
      })
    );

    await this.loadActiveSessions();
  }

  async loadActiveSessions(isReload: boolean = false): Promise<void> {
    this.activeSessions = await this.sessionQueueService.getActiveSessions().toPromise();

    if (isReload) {
      this.messageService.add({ severity: 'success', summary: 'Data Refreshed', detail: 'Queue refreshed successfully' });
    }
  }

  confirmAcceptSession(session: QueuedCustomerAgentDto): void {
    this.webSocketService.acceptRequest(session.queueInfo.id);
    this.acceptedCallLoadingText = "Please wait.! Waiting for the customer to accept request.";
    this.spinner.show();
  }

  confirmRejectSession(session: QueuedCustomerAgentDto): void {
    this.webSocketService.rejectRequest(session.queueInfo.id);
  }


  notifyAgentOnNewCustomer(dto: QueuedCustomerAgentDto) {
    let title = 'New Customer in WaitingRoom';
    let content = `${dto.customerInfo.name} is in WaitingRoom`;

    this.sendPushNotification(title, content);
  }

  async onRefreshKycSessionQueue(payload: any) {
    await this.loadActiveSessions();
  }

  joinToSession() {
    let url = `/agent-join-session/${this.queuedCustomerAgentDTO.queueInfo.id}`
    this.router.navigateByUrl(url);
  }

  async onCustomerConnectsToCall(dto: QueuedCustomerAgentDto) {
    this.queuedCustomerAgentDTO = dto;
    this.acceptedCallLoadingText = `${dto.customerInfo.name} connected to the Video KYC Call`;
    setTimeout(() => {
      this.joinToSession();
    }, 700);
  }

  sendPushNotification(title: string, content: string) {
    let pushNotificationContent: any = [{
      'title': title,
      'alertContent': content
    }];

    this.pushNotificationService.generateNotification(pushNotificationContent);
    this.messageService.add({ severity: 'success', summary: title, detail: content });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
    this.subscriptions = [];
    this.spinner.hide();
  }
}
