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

import { DownloadCallRecordingDto } from '../models/download-call-recording-dto';
import { NewMessageRequest } from '../models/new-message-request';

@Injectable({
  providedIn: 'root',
})
export class VideoKycWebhookService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation onParticipantConnected
   */
  static readonly OnParticipantConnectedPath = '/api/VideoKycWebhook/onParticipantConnected';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onParticipantConnected()` instead.
   *
   * This method doesn't expect any request body.
   */
  onParticipantConnected$Response(params?: {
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, VideoKycWebhookService.OnParticipantConnectedPath, 'post');
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
   * To access the full response (for headers, for example), `onParticipantConnected$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  onParticipantConnected(params?: {
  }): Observable<boolean> {

    return this.onParticipantConnected$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Path part for operation onParticipantDisconnected
   */
  static readonly OnParticipantDisconnectedPath = '/api/VideoKycWebhook/onParticipantDisconnected';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onParticipantDisconnected()` instead.
   *
   * This method doesn't expect any request body.
   */
  onParticipantDisconnected$Response(params?: {
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, VideoKycWebhookService.OnParticipantDisconnectedPath, 'post');
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
   * To access the full response (for headers, for example), `onParticipantDisconnected$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  onParticipantDisconnected(params?: {
  }): Observable<boolean> {

    return this.onParticipantDisconnected$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Path part for operation onWorkflowFinished
   */
  static readonly OnWorkflowFinishedPath = '/api/VideoKycWebhook/onWorkflowFinished';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onWorkflowFinished()` instead.
   *
   * This method doesn't expect any request body.
   */
  onWorkflowFinished$Response(params?: {
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, VideoKycWebhookService.OnWorkflowFinishedPath, 'post');
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
   * To access the full response (for headers, for example), `onWorkflowFinished$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  onWorkflowFinished(params?: {
  }): Observable<boolean> {

    return this.onWorkflowFinished$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Path part for operation onActivityDataGathered
   */
  static readonly OnActivityDataGatheredPath = '/api/VideoKycWebhook/onActivityDataGathered';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onActivityDataGathered()` instead.
   *
   * This method doesn't expect any request body.
   */
  onActivityDataGathered$Response(params?: {
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, VideoKycWebhookService.OnActivityDataGatheredPath, 'post');
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
   * To access the full response (for headers, for example), `onActivityDataGathered$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  onActivityDataGathered(params?: {
  }): Observable<boolean> {

    return this.onActivityDataGathered$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Path part for operation onActivityAction
   */
  static readonly OnActivityActionPath = '/api/VideoKycWebhook/onActivityAction';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onActivityAction()` instead.
   *
   * This method doesn't expect any request body.
   */
  onActivityAction$Response(params?: {
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, VideoKycWebhookService.OnActivityActionPath, 'post');
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
   * To access the full response (for headers, for example), `onActivityAction$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  onActivityAction(params?: {
  }): Observable<boolean> {

    return this.onActivityAction$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Path part for operation onRecordingAvailable
   */
  static readonly OnRecordingAvailablePath = '/api/VideoKycWebhook/onRecordingAvailable';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onRecordingAvailable()` instead.
   *
   * This method doesn't expect any request body.
   */
  onRecordingAvailable$Response(params?: {
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, VideoKycWebhookService.OnRecordingAvailablePath, 'post');
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
   * To access the full response (for headers, for example), `onRecordingAvailable$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  onRecordingAvailable(params?: {
  }): Observable<boolean> {

    return this.onRecordingAvailable$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Path part for operation sendMessage
   */
  static readonly SendMessagePath = '/api/VideoKycWebhook/sendMessage';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `sendMessage()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  sendMessage$Response(params: {
    body: NewMessageRequest
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, VideoKycWebhookService.SendMessagePath, 'post');
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
   * To access the full response (for headers, for example), `sendMessage$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  sendMessage(params: {
    body: NewMessageRequest
  }): Observable<boolean> {

    return this.sendMessage$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Path part for operation deleteAllEntries_2
   */
  static readonly DeleteAllEntries_2Path = '/api/VideoKycWebhook/deleteAllEntries';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteAllEntries_2()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteAllEntries_2$Response(params?: {
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, VideoKycWebhookService.DeleteAllEntries_2Path, 'post');
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
   * To access the full response (for headers, for example), `deleteAllEntries_2$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteAllEntries_2(params?: {
  }): Observable<boolean> {

    return this.deleteAllEntries_2$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Path part for operation downloadCallRecording
   */
  static readonly DownloadCallRecordingPath = '/api/VideoKycWebhook/downloadCallRecording';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `downloadCallRecording()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  downloadCallRecording$Response(params: {
    body: DownloadCallRecordingDto
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, VideoKycWebhookService.DownloadCallRecordingPath, 'post');
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
   * To access the full response (for headers, for example), `downloadCallRecording$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  downloadCallRecording(params: {
    body: DownloadCallRecordingDto
  }): Observable<boolean> {

    return this.downloadCallRecording$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Path part for operation callRecording
   */
  static readonly CallRecordingPath = '/api/VideoKycWebhook/callRecording/{sessionId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `callRecording()` instead.
   *
   * This method doesn't expect any request body.
   */
  callRecording$Response(params: {
    sessionId: string;
  }): Observable<StrictHttpResponse<void>> {

    const rb = new RequestBuilder(this.rootUrl, VideoKycWebhookService.CallRecordingPath, 'get');
    if (params) {
      rb.path('sessionId', params.sessionId, {});
    }

    return this.http.request(rb.build({
      responseType: 'text',
      accept: '*/*'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `callRecording$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  callRecording(params: {
    sessionId: string;
  }): Observable<void> {

    return this.callRecording$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }

}
