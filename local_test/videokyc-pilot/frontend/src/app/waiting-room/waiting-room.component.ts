import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { CustomerDto, QueuedCustomerAgentDto } from '../api/models';
import { CustomerService } from '../api/services';
import { AppURL } from '../app.url';
import { AuthenticationService } from '../services/authentication.service';
import { WebSocketService } from '../services/websocket.service';
import { KYCStatus } from '../types/kyc-status';
import { PushNotificationsService } from '../utils/push.notification.service';

declare type Unsubscribable = Subscription | Subject<any>;

@Component({
  selector: 'waiting-room',
  templateUrl: './waiting-room.component.html'
})

export class WaitingRoomComponent implements OnInit, OnDestroy {
  public AppURL = AppURL;
  public loading: boolean = false;
  public queueId: number;
  public customerInfo: CustomerDto;

  private subscriptions: Unsubscribable[] = [];

  public queuedCustomerAgentDTO: QueuedCustomerAgentDto;

  public isCustomerAuthenticated: boolean;
  public invalidSession: boolean;

  paramMapSubscription: Subscription;

  constructor(
    private messageService: MessageService,
    private webSocketService: WebSocketService,
    private pushNotificationService: PushNotificationsService,
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private authenticationService: AuthenticationService
  ) {
    this.pushNotificationService.requestPermission();
  }

  public get KycStatus(): typeof KYCStatus {
    return KYCStatus;
  }

  isAllowedForKyc(): boolean {
    let isAllowed = (this.customerKycStatus != this.KycStatus.accepted) &&
      (this.customerKycStatus != this.KycStatus.toBeAudited) && (this.customerKycStatus != this.KycStatus.rejected);
    return isAllowed;
  }

  getCssBasedOnKYC(): string {
    let css = "";
    switch (this.customerKycStatus) {
      case KYCStatus.notStarted:
      case KYCStatus.scheduled:
      case KYCStatus.inProgress:

      case KYCStatus.toBeAudited:
      case KYCStatus.accepted:
        css = "alert-success"
        break;

      case KYCStatus.rejected:
        css = "alert-warning"
        break;
      default:
    }

    return `alert ${css} alert-has-icon`;
  }


  get customerKycStatus() {
    if (!this.customerInfo) {
      return KYCStatus.notStarted;
    }
    return this.customerInfo.kycStatus as KYCStatus;
  }

  ngOnInit(): void {

    this.loading = true;

    //Getting the route params
    this.paramMapSubscription = this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.queueId = +params.get('id');

      try {
        await this.getCustomerInfo();

        if (this.customerInfo != null) {
          await this.authenticateCustomer();

          //If KYC is not done, then only redirect to join
          if (this.isCustomerAuthenticated && this.isAllowedForKyc()) {
            this.subscriptions.push(
              this.webSocketService.onWaitingPeriodReceived$.subscribe((payload: any) => {
                //TODO
                console.log(payload);
              }),
              this.webSocketService.onJoinSession$.subscribe((queuedCustomerAgentDTO: QueuedCustomerAgentDto) => {
                this.onCallRequestAccepted(queuedCustomerAgentDTO);
              })
            );

            this.webSocketService.connectCustomerToWebSocketEvents();
            this.webSocketService.getWaitingPeriod(this.queueId);
          }
        } else {
          this.invalidSession = true;
        }
      } catch (error) {
      }

      this.loading = false;
    });
  }

  async authenticateCustomer() {
    try {
      //Login for the existing Customer
      await this.authenticationService.authenticateCustomer(this.customerInfo.panNumber, this.customerInfo.phone);
      this.isCustomerAuthenticated = true;
      // redirect to returnUrl from route parameters or default to '/'
    } catch (error: any) {
      this.isCustomerAuthenticated = false;
      let msg = 'An error has occurred!';

      if (error.error.message) {
        msg = error.error.message;
      }
    }
  }

  async getCustomerInfo() {
    this.customerInfo = await this.customerService.getCustomerByQueueId({ queueId: this.queueId }).toPromise();
  }

  onCallRequestAccepted(payload: QueuedCustomerAgentDto): void {
    this.queuedCustomerAgentDTO = payload;
    let title = `Video KYC Session Call is scheduled with - ${payload.agentInfo.name} `
    let content = `Your Video KYC Session is about to start.Please join the session`;

    this.sendPushNotification(title, content);

    this.joinToSession();
  }

  joinToSession(): void {
    let url = `/join-session/${this.queuedCustomerAgentDTO.queueInfo.id}`
    this.router.navigateByUrl(url);
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
    if (this.paramMapSubscription) {
      this.paramMapSubscription.unsubscribe();
      this.paramMapSubscription = null;
    }
    this.subscriptions.forEach((subscription) => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
    this.subscriptions = [];
  }

  navigateToHome() {
    this.router.navigate([AppURL.Customer]);
  }
}