import { AfterViewInit } from '@angular/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription, Subject } from 'rxjs';
import { QueuedCustomerAgentDto } from 'src/app/api/models';
import { WebSocketService } from 'src/app/services/websocket.service';
import { PushNotificationsService } from 'src/app/utils/push.notification.service';
declare const App: any;

declare type Unsubscribable = Subscription | Subject<any>;

@Component({
  selector: 'agent-layout',
  templateUrl: './agent-layout.component.html'
})
export class AgentLayoutComponent implements OnInit, OnDestroy {
  copyRightYear = new Date().getFullYear();

  private subscriptions: Unsubscribable[] = [];

  constructor(
    private messageService: MessageService,
    private webSocketService: WebSocketService,
    private pushNotificationService: PushNotificationsService,
  ) {
  }

  async ngOnInit() {
    this.messageService.add({ severity: 'success', summary: 'ngAfterViewInit', detail: 'ngAfterViewInit' });

    App.initialLoadPage();

    this.webSocketService.connectAgentToWebSocketEvents();

    this.subscriptions.push(
      this.webSocketService.onCustomerWaiting$.subscribe((payload: QueuedCustomerAgentDto) => {
        this.notifyAgentOnNewCustomer(payload);
      }),
    );
  }

  notifyAgentOnNewCustomer(dto: QueuedCustomerAgentDto) {
    let title = 'New Customer in WaitingRoom';
    let content = `${dto.customerInfo.name} is in WaitingRoom`;

    this.sendPushNotification(title, content);
  }

  sendPushNotification(title: string, content: string) {
    let pushNotificationContent: any = [{
      'title': title,
      'alertContent': content
    }];

    this.pushNotificationService.generateNotification(pushNotificationContent);
    this.messageService.add({ severity: 'success', summary: title, detail: content });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
    this.subscriptions = [];
  }
}