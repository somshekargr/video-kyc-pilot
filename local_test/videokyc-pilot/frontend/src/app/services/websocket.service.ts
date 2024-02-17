import { Injectable, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject, Subscription } from 'rxjs';
import { QueuedCustomerAgentDto } from '../api/models';
import { WebSocketEvents } from '../models/workflow-events';
import { AppConstants } from '../utils/app-constants';
import { AuthenticationService } from './authentication.service';

declare type Unsubscribable = Subscription | Subject<any>;

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: Socket;

  private onWaitingPeriodReceivedSubject = new Subject<any>();
  onWaitingPeriodReceived$: Observable<any>;

  private onJoinSessionSubject = new Subject<any>();
  onJoinSession$: Observable<any>;

  private onCustomerWaitingSubject = new Subject<QueuedCustomerAgentDto>();
  onCustomerWaiting$: Observable<QueuedCustomerAgentDto>;

  private onRefreshKycSessionQueueSubject = new Subject<any>();
  onRefreshKycSessionQueueWaiting$: Observable<any>;

  private customerAcceptsCallSubject = new Subject<any>();
  customerAcceptsCall$: Observable<any>;

  constructor(private authenticationService: AuthenticationService) {
    this.onJoinSession$ = this.onJoinSessionSubject.asObservable();

    this.onWaitingPeriodReceived$ = this.onWaitingPeriodReceivedSubject.asObservable();

    this.onCustomerWaiting$ = this.onCustomerWaitingSubject.asObservable();

    this.onRefreshKycSessionQueueWaiting$ = this.onRefreshKycSessionQueueSubject.asObservable();

    this.customerAcceptsCall$ = this.customerAcceptsCallSubject.asObservable();
  }

  /// USer Related websocket events

  connectCustomerToWebSocketEvents() {
    this.createWebSocket();

    this.socket.on(WebSocketEvents.onWaitingPeriodReceived, (payload: any) => {
      this.onWaitingPeriodReceived(payload);
    });

    this.socket.on(WebSocketEvents.onJoinSession, (payload: any) => {
      this.onJoinSession(payload);
    });

    this.socket.connect();
  }

  //Once the Session is valid and created. Lets listen to events from server
  connectQueuedCustomerToWebSocketEvents() {
    this.createWebSocket();
    this.socket.connect();
  }

  connectAgentToWebSocketEvents() {
    this.createWebSocket();

    this.socket.on(WebSocketEvents.customerWaiting, (payload: any) => {
      this.onCustomerWaiting(payload);
    });

    this.socket.on(WebSocketEvents.refreshKycSessionQueue, (payload: any) => {
      this.onRefreshKycSessionQueue(payload);
    });

    this.socket.on(WebSocketEvents.customerAcceptsCall, (payload: any) => {
      this.onCustomerAcceptsCall(payload);
    });

    this.socket.connect();
  }

  private createWebSocket() {
    const token = this.authenticationService.currentUserValue.token;
    const path = ['localhost', '127.0.0.1'].includes(location.hostname) ? undefined : '/api/socket.io';

    //ws://localhost:3341
    this.socket = new Socket({
      url: `${AppConstants.webSocketIoConfig.url}`,
      options: {
        path: path,
        transports: ['websocket'],
        query: { token },
      },
    });
  }

  onWaitingPeriodReceived(payload: any) {
    this.onWaitingPeriodReceivedSubject.next(payload);
  }

  //Event called by Customer
  getWaitingPeriod(queueId: number) {
    this.socket.emit(WebSocketEvents.getWaitingPeriod, {
      eventData: { queueId: queueId },
    });
  }

  onJoinSession(payload: any) {
    this.onJoinSessionSubject.next(payload.queuedCustomerAgentDTO);
  }

  onCustomerConnectsToCall(queueId: number) {
    this.socket.emit(WebSocketEvents.onCustomerConnectsToCall, {
      eventData: { queueId: queueId },
    });
  }

  /// USer Related websocket events ends

  /// USer Related websocket events

  onCustomerAcceptsCall(payload: any) {
    this.customerAcceptsCallSubject.next(payload.QueuedCustomerAgentDTO);
  }

  acceptRequest(queueId: number) {
    this.socket.emit(WebSocketEvents.acceptRequest, {
      eventData: { queueId: queueId },
    });
  }

  rejectRequest(queueId: number) {
    this.socket.emit(WebSocketEvents.rejectRequest, {
      eventData: { queueId: queueId },
    });
  }

  onCustomerWaiting(payload: any) {
    this.onCustomerWaitingSubject.next(payload.QueuedCustomerAgentDTO);
  }

  onRefreshKycSessionQueue(payload: any) {
    this.onRefreshKycSessionQueueSubject.next(payload);
  }
}
