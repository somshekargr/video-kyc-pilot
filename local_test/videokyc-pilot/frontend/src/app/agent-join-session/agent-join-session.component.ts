import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AgentJoinLinkInfo } from '../api/models';
import { KycSessionQueueService } from '../api/services';
import { AppURL } from '../app.url';

@Component({
  selector: 'app-agent-join-session',
  templateUrl: './agent-join-session.component.html'
})
export class AgentJoinSessionComponent implements OnInit, OnDestroy {

  public loading: boolean = true;
  public isValidSession: boolean;
  public sessionCreated: boolean;
  public agentJoinLinkInfo: AgentJoinLinkInfo;
  public queueId: number;
  public callInProgress: boolean = false;
  public videoFloAccessToken: string;
  public callFinished: boolean = false;
  public AppURL = AppURL;
  public hasVideoFloError: boolean = false;

  private routeParamsSubscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private kycSessionQueueService: KycSessionQueueService,
  ) { }

  ngOnDestroy(): void {
    if (this.routeParamsSubscription) {
      this.routeParamsSubscription.unsubscribe();
      this.routeParamsSubscription = null;
    }
  }

  ngOnInit(): void {
    this.routeParamsSubscription = this.route.paramMap.subscribe(async (params: ParamMap) => {
      try {
        this.queueId = +params.get('id');

        //Validate the session
        await this.validateQueueSession();

        //Once after the valid session, lets get the joining info
        if (this.isValidSession) {

          await this.getAccessToken();

          await this.updateQueueStateOnAgentConnected();

          await this.getCustomerJoinLink();

          this.loading = false;
          this.callInProgress = true;
        } else {
          this.loading = false;
          this.callInProgress = false;
        }
      } catch (error) {
        this.loading = false;
      }
    });
  }

  //Making sure that the queue is not outdated or completed
  async validateQueueSession() {
    this.isValidSession = await this.kycSessionQueueService.isValidSession({ queueId: this.queueId }).toPromise();
  }

  // async createSession() {
  //   debugger;
  //   this.sessionCreated = await this.kycSessionQueueService.createSession({ body: { queueId: this.queueId } }).toPromise();
  // }

  async getCustomerJoinLink() {
    this.agentJoinLinkInfo = await this.kycSessionQueueService.getAgentJoinLink({ queueId: this.queueId }).toPromise();
  }

  async updateQueueStateOnAgentConnected() {
    await this.kycSessionQueueService.updateQueueStateOnAgentConnected({ body: { queueId: this.queueId } }).toPromise();
  }

  async getAccessToken() {
    let data = await this.kycSessionQueueService.getVideofloAccessToken().toPromise();
    this.videoFloAccessToken = data.accessToken;
  }

  onVideofloError(error: any) {
    console.error(error);
    this.hasVideoFloError = true;
  }

  onVideofloLeaveSession(eventData: any) {
    this.callFinished = true;
    console.info(eventData);
    // TODO Redirect back to other Page
  }

  canShowWebComponent() {
    if (this.callFinished)
      return false;

    return !this.loading && this.isValidSession && !!this.agentJoinLinkInfo && this.callInProgress;
  }

  redirectToHome() {
    this.router.navigate([AppURL.QueueBoard]);
  }
}
