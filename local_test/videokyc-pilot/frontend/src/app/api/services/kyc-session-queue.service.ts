/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { AgentJoinLinkInfo } from '../models/agent-join-link-info';
import { AuditDto } from '../models/audit-dto';
import { CreateSessionInfo } from '../models/create-session-info';
import { CustomerJoinLinkInfo } from '../models/customer-join-link-info';
import { QueuedCustomerAgentDto } from '../models/queued-customer-agent-dto';
import { SessionInfo } from '../models/session-info';
import { VideoFloAccessTokenDto } from '../models/video-flo-access-token-dto';
import { VideofloSessionDto } from '../models/videoflo-session-dto';

@Injectable({
  providedIn: 'root',
})
export class KycSessionQueueService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation getActiveSessions
   */
  static readonly GetActiveSessionsPath = '/api/kycSessionQueue/getActiveSessions';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getActiveSessions()` instead.
   *
   * This method doesn't expect any request body.
   */
  getActiveSessions$Response(params?: {
  }): Observable<StrictHttpResponse<Array<QueuedCustomerAgentDto>>> {

    const rb = new RequestBuilder(this.rootUrl, KycSessionQueueService.GetActiveSessionsPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<QueuedCustomerAgentDto>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getActiveSessions$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getActiveSessions(params?: {
  }): Observable<Array<QueuedCustomerAgentDto>> {

    return this.getActiveSessions$Response(params).pipe(
      map((r: StrictHttpResponse<Array<QueuedCustomerAgentDto>>) => r.body as Array<QueuedCustomerAgentDto>)
    );
  }

  /**
   * Path part for operation getQueuedCustomerAgentDto
   */
  static readonly GetQueuedCustomerAgentDtoPath = '/api/kycSessionQueue/getQueuedCustomerAgentDTO/{queueId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getQueuedCustomerAgentDto()` instead.
   *
   * This method doesn't expect any request body.
   */
  getQueuedCustomerAgentDto$Response(params: {
    queueId: number;
  }): Observable<StrictHttpResponse<QueuedCustomerAgentDto>> {

    const rb = new RequestBuilder(this.rootUrl, KycSessionQueueService.GetQueuedCustomerAgentDtoPath, 'get');
    if (params) {
      rb.path('queueId', params.queueId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<QueuedCustomerAgentDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getQueuedCustomerAgentDto$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getQueuedCustomerAgentDto(params: {
    queueId: number;
  }): Observable<QueuedCustomerAgentDto> {

    return this.getQueuedCustomerAgentDto$Response(params).pipe(
      map((r: StrictHttpResponse<QueuedCustomerAgentDto>) => r.body as QueuedCustomerAgentDto)
    );
  }

  /**
   * Path part for operation getCallCompletedSessions
   */
  static readonly GetCallCompletedSessionsPath = '/api/kycSessionQueue/getCallCompletedSessions';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCallCompletedSessions()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCallCompletedSessions$Response(params?: {
  }): Observable<StrictHttpResponse<Array<QueuedCustomerAgentDto>>> {

    const rb = new RequestBuilder(this.rootUrl, KycSessionQueueService.GetCallCompletedSessionsPath, 'get');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<Array<QueuedCustomerAgentDto>>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getCallCompletedSessions$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCallCompletedSessions(params?: {
  }): Observable<Array<QueuedCustomerAgentDto>> {

    return this.getCallCompletedSessions$Response(params).pipe(
      map((r: StrictHttpResponse<Array<QueuedCustomerAgentDto>>) => r.body as Array<QueuedCustomerAgentDto>)
    );
  }

  /**
   * Path part for operation getSessionById
   */
  static readonly GetSessionByIdPath = '/api/kycSessionQueue/getSessionById/{queueId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getSessionById()` instead.
   *
   * This method doesn't expect any request body.
   */
  getSessionById$Response(params: {
    queueId: number;
  }): Observable<StrictHttpResponse<VideofloSessionDto>> {

    const rb = new RequestBuilder(this.rootUrl, KycSessionQueueService.GetSessionByIdPath, 'get');
    if (params) {
      rb.path('queueId', params.queueId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<VideofloSessionDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getSessionById$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getSessionById(params: {
    queueId: number;
  }): Observable<VideofloSessionDto> {

    return this.getSessionById$Response(params).pipe(
      map((r: StrictHttpResponse<VideofloSessionDto>) => r.body as VideofloSessionDto)
    );
  }

  /**
   * Path part for operation getAgentJoinLink
   */
  static readonly GetAgentJoinLinkPath = '/api/kycSessionQueue/getAgentJoinLink/{queueId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAgentJoinLink()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAgentJoinLink$Response(params: {
    queueId: number;
  }): Observable<StrictHttpResponse<AgentJoinLinkInfo>> {

    const rb = new RequestBuilder(this.rootUrl, KycSessionQueueService.GetAgentJoinLinkPath, 'get');
    if (params) {
      rb.path('queueId', params.queueId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<AgentJoinLinkInfo>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getAgentJoinLink$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAgentJoinLink(params: {
    queueId: number;
  }): Observable<AgentJoinLinkInfo> {

    return this.getAgentJoinLink$Response(params).pipe(
      map((r: StrictHttpResponse<AgentJoinLinkInfo>) => r.body as AgentJoinLinkInfo)
    );
  }

  /**
   * Path part for operation getCustomerJoinLink
   */
  static readonly GetCustomerJoinLinkPath = '/api/kycSessionQueue/getCustomerJoinLink/{queueId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCustomerJoinLink()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCustomerJoinLink$Response(params: {
    queueId: number;
  }): Observable<StrictHttpResponse<CustomerJoinLinkInfo>> {

    const rb = new RequestBuilder(this.rootUrl, KycSessionQueueService.GetCustomerJoinLinkPath, 'get');
    if (params) {
      rb.path('queueId', params.queueId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<CustomerJoinLinkInfo>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getCustomerJoinLink$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCustomerJoinLink(params: {
    queueId: number;
  }): Observable<CustomerJoinLinkInfo> {

    return this.getCustomerJoinLink$Response(params).pipe(
      map((r: StrictHttpResponse<CustomerJoinLinkInfo>) => r.body as CustomerJoinLinkInfo)
    );
  }

  /**
   * Path part for operation isValidSession
   */
  static readonly IsValidSessionPath = '/api/kycSessionQueue/isValidSession/{queueId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `isValidSession()` instead.
   *
   * This method doesn't expect any request body.
   */
  isValidSession$Response(params: {
    queueId: number;
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, KycSessionQueueService.IsValidSessionPath, 'get');
    if (params) {
      rb.path('queueId', params.queueId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: String((r as HttpResponse<any>).body) === 'true' }) as StrictHttpResponse<boolean>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `isValidSession$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  isValidSession(params: {
    queueId: number;
  }): Observable<boolean> {

    return this.isValidSession$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Path part for operation createSession
   */
  static readonly CreateSessionPath = '/api/kycSessionQueue/createSession';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createSession()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createSession$Response(params: {
    body: CreateSessionInfo
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, KycSessionQueueService.CreateSessionPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: String((r as HttpResponse<any>).body) === 'true' }) as StrictHttpResponse<boolean>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `createSession$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createSession(params: {
    body: CreateSessionInfo
  }): Observable<boolean> {

    return this.createSession$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Path part for operation updateQueueStateOnAgentConnected
   */
  static readonly UpdateQueueStateOnAgentConnectedPath = '/api/kycSessionQueue/updateQueueStateOnAgentConnected';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateQueueStateOnAgentConnected()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateQueueStateOnAgentConnected$Response(params: {
    body: SessionInfo
  }): Observable<StrictHttpResponse<QueuedCustomerAgentDto>> {

    const rb = new RequestBuilder(this.rootUrl, KycSessionQueueService.UpdateQueueStateOnAgentConnectedPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<QueuedCustomerAgentDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `updateQueueStateOnAgentConnected$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateQueueStateOnAgentConnected(params: {
    body: SessionInfo
  }): Observable<QueuedCustomerAgentDto> {

    return this.updateQueueStateOnAgentConnected$Response(params).pipe(
      map((r: StrictHttpResponse<QueuedCustomerAgentDto>) => r.body as QueuedCustomerAgentDto)
    );
  }

  /**
   * Path part for operation updateQueueStateOnCustomerConnected
   */
  static readonly UpdateQueueStateOnCustomerConnectedPath = '/api/kycSessionQueue/updateQueueStateOnCustomerConnected';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateQueueStateOnCustomerConnected()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateQueueStateOnCustomerConnected$Response(params: {
    body: SessionInfo
  }): Observable<StrictHttpResponse<QueuedCustomerAgentDto>> {

    const rb = new RequestBuilder(this.rootUrl, KycSessionQueueService.UpdateQueueStateOnCustomerConnectedPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<QueuedCustomerAgentDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `updateQueueStateOnCustomerConnected$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateQueueStateOnCustomerConnected(params: {
    body: SessionInfo
  }): Observable<QueuedCustomerAgentDto> {

    return this.updateQueueStateOnCustomerConnected$Response(params).pipe(
      map((r: StrictHttpResponse<QueuedCustomerAgentDto>) => r.body as QueuedCustomerAgentDto)
    );
  }

  /**
   * Path part for operation updateQueueStateOnCallCompleted
   */
  static readonly UpdateQueueStateOnCallCompletedPath = '/api/kycSessionQueue/updateQueueStateOnCallCompleted';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateQueueStateOnCallCompleted()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateQueueStateOnCallCompleted$Response(params: {
    body: SessionInfo
  }): Observable<StrictHttpResponse<QueuedCustomerAgentDto>> {

    const rb = new RequestBuilder(this.rootUrl, KycSessionQueueService.UpdateQueueStateOnCallCompletedPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<QueuedCustomerAgentDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `updateQueueStateOnCallCompleted$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateQueueStateOnCallCompleted(params: {
    body: SessionInfo
  }): Observable<QueuedCustomerAgentDto> {

    return this.updateQueueStateOnCallCompleted$Response(params).pipe(
      map((r: StrictHttpResponse<QueuedCustomerAgentDto>) => r.body as QueuedCustomerAgentDto)
    );
  }

  /**
   * Path part for operation getVideofloAccessToken
   */
  static readonly GetVideofloAccessTokenPath = '/api/kycSessionQueue/getVideofloAccessToken';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getVideofloAccessToken()` instead.
   *
   * This method doesn't expect any request body.
   */
  getVideofloAccessToken$Response(params?: {
  }): Observable<StrictHttpResponse<VideoFloAccessTokenDto>> {

    const rb = new RequestBuilder(this.rootUrl, KycSessionQueueService.GetVideofloAccessTokenPath, 'post');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<VideoFloAccessTokenDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getVideofloAccessToken$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getVideofloAccessToken(params?: {
  }): Observable<VideoFloAccessTokenDto> {

    return this.getVideofloAccessToken$Response(params).pipe(
      map((r: StrictHttpResponse<VideoFloAccessTokenDto>) => r.body as VideoFloAccessTokenDto)
    );
  }

  /**
   * Path part for operation updateAudit
   */
  static readonly UpdateAuditPath = '/api/kycSessionQueue/updateAudit';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateAudit()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateAudit$Response(params: {
    body: AuditDto
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, KycSessionQueueService.UpdateAuditPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: String((r as HttpResponse<any>).body) === 'true' }) as StrictHttpResponse<boolean>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `updateAudit$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateAudit(params: {
    body: AuditDto
  }): Observable<boolean> {

    return this.updateAudit$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Path part for operation testMethod
   */
  static readonly TestMethodPath = '/api/kycSessionQueue/testMethod';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `testMethod()` instead.
   *
   * This method doesn't expect any request body.
   */
  testMethod$Response(params?: {
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, KycSessionQueueService.TestMethodPath, 'post');
    if (params) {
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: String((r as HttpResponse<any>).body) === 'true' }) as StrictHttpResponse<boolean>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `testMethod$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  testMethod(params?: {
  }): Observable<boolean> {

    return this.testMethod$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

}
