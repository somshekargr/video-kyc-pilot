import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CustomerJoinLinkInfo, QueuedCustomerAgentDto } from '../api/models';
import { KycSessionQueueService } from '../api/services';
import { AppURL } from '../app.url';
import { QueueStatus } from '../models/queue-status';
import { WebSocketService } from '../services/websocket.service';
import { PushNotificationsService } from '../utils/push.notification.service';

@Component({
  selector: 'app-join-session',
  templateUrl: './join-session.component.html'
})
export class JoinSessionComponent implements OnInit, OnDestroy {
  public loading: boolean = true;
  public isValidSession: boolean;
  public sessionCreated: boolean;
  public customerJoinLinkInfo: CustomerJoinLinkInfo;
  public callInProgress: boolean = false;
  public callFinished: boolean = false;

  public callDisconnected: boolean = false;


  public AppURL = AppURL;
  public videoFloAccessToken: string;

  public hasVideoFloError: boolean = false;

  public queuedCustomerAgentDTO: QueuedCustomerAgentDto;

  public queueId: number;

  paramMapSubscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private kycSessionQueueService: KycSessionQueueService,
    private messageService: MessageService,
    private webSocketService: WebSocketService,
    private pushNotificationService: PushNotificationsService
  ) {
    this.pushNotificationService.requestPermission();
  }

  ngOnDestroy(): void {
    if (this.paramMapSubscription) {
      this.paramMapSubscription.unsubscribe();
      this.paramMapSubscription = null;
    }
  }

  ngOnInit(): void {
    //Getting the route params
    this.paramMapSubscription = this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.queueId = +params.get('id');
      try {
        await this.validateQueueSession();

        if (this.isValidSession) {
          await this.getAccessToken();
          this.webSocketService.onCustomerConnectsToCall(this.queueId);

          await this.createSession();

          await this.getCustomerJoinLink();
          this.loading = false;

          //Lets update the QueueState as 'Call connected'
          await this.updateQueueStateOnCustomerConnected();

          this.callInProgress = true;
        } else {
          this.callInProgress = false;
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
      }
    });

    //Connecting to websocket events
    this.webSocketService.connectQueuedCustomerToWebSocketEvents();
  }

  //Making sure that the queue is not outdated or completed
  async validateQueueSession() {
    this.isValidSession = await this.kycSessionQueueService.isValidSession({ queueId: this.queueId }).toPromise();
  }

  async createSession() {
    this.sessionCreated = await this.kycSessionQueueService.createSession({ body: { queueId: this.queueId } }).toPromise();
  }

  async getQueuedCustomerAgentDTO() {
    let queue = await this.kycSessionQueueService.getQueuedCustomerAgentDto({ queueId: this.queueId }).toPromise();
    if (queue.queueInfo.queueStatus == QueueStatus.callDisconnected) {
      this.callDisconnected = true;
    }
    if (queue.queueInfo.queueStatus == QueueStatus.callCompleted) {
      this.callFinished = true;
    }
  }

  setIntervalX(callback: any, delay: number, repetitions: number) {
    var x = 0;
    var intervalID = window.setInterval(function () {

      callback();

      if (++x === repetitions) {
        window.clearInterval(intervalID);
      }
    }, delay);
  }

  async getCustomerJoinLink() {
    this.customerJoinLinkInfo = await this.kycSessionQueueService.getCustomerJoinLink({ queueId: this.queueId }).toPromise();
  }

  async getAccessToken() {
    let data = await this.kycSessionQueueService.getVideofloAccessToken().toPromise();
    this.videoFloAccessToken = data.accessToken;
  }

  async updateQueueStateOnCustomerConnected() {
    let payload = { body: { queueId: this.queueId } };
    this.queuedCustomerAgentDTO = await this.kycSessionQueueService.updateQueueStateOnCustomerConnected(payload).toPromise();
  }


  onVideofloError(error: any) {
    console.error(error);
    this.hasVideoFloError = true;
  }

  onVideofloLeaveSession(eventData: any) {
    let _this = this;
    this.setIntervalX(function () {
      _this.getQueuedCustomerAgentDTO();
    }, 1000, 5);


    console.info(eventData);
  }

  canShowWebComponent() {
    if (this.callFinished)
      return false;

    return this.loading == false && this.isValidSession && this.sessionCreated && this.customerJoinLinkInfo != undefined && this.callInProgress && this.callDisconnected == false;
  }

  redirectToHome() {
    this.router.navigate([AppURL.Customer]);
  }

  rejoin() {
    this.redirectTo(`/join-session/${this.queueId}`);
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }
}
