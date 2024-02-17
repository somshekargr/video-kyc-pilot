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

import { ApiResponse } from '../models/api-response';
import { AuthenticatedCustomerDto } from '../models/authenticated-customer-dto';
import { CustomerDto } from '../models/customer-dto';
import { CustomerLoginDto } from '../models/customer-login-dto';
import { NewCustomerDto } from '../models/new-customer-dto';
import { PanLookupDto } from '../models/pan-lookup-dto';

@Injectable({
  providedIn: 'root',
})
export class CustomerService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation isRegistered
   */
  static readonly IsRegisteredPath = '/api/customer/isRegistered';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `isRegistered()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  isRegistered$Response(params: {
    body: PanLookupDto
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, CustomerService.IsRegisteredPath, 'post');
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
   * To access the full response (for headers, for example), `isRegistered$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  isRegistered(params: {
    body: PanLookupDto
  }): Observable<boolean> {

    return this.isRegistered$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Path part for operation getCustomer
   */
  static readonly GetCustomerPath = '/api/customer/getCustomer/{id}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCustomer()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCustomer$Response(params: {
    id: number;
  }): Observable<StrictHttpResponse<CustomerDto>> {

    const rb = new RequestBuilder(this.rootUrl, CustomerService.GetCustomerPath, 'get');
    if (params) {
      rb.path('id', params.id, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<CustomerDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getCustomer$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCustomer(params: {
    id: number;
  }): Observable<CustomerDto> {

    return this.getCustomer$Response(params).pipe(
      map((r: StrictHttpResponse<CustomerDto>) => r.body as CustomerDto)
    );
  }

  /**
   * Path part for operation getCustomerByQueueId
   */
  static readonly GetCustomerByQueueIdPath = '/api/customer/getCustomerByQueueId/{queueId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCustomerByQueueId()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCustomerByQueueId$Response(params: {
    queueId: number;
  }): Observable<StrictHttpResponse<CustomerDto>> {

    const rb = new RequestBuilder(this.rootUrl, CustomerService.GetCustomerByQueueIdPath, 'get');
    if (params) {
      rb.path('queueId', params.queueId, {});
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<CustomerDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getCustomerByQueueId$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCustomerByQueueId(params: {
    queueId: number;
  }): Observable<CustomerDto> {

    return this.getCustomerByQueueId$Response(params).pipe(
      map((r: StrictHttpResponse<CustomerDto>) => r.body as CustomerDto)
    );
  }

  /**
   * Path part for operation getCustomerByPan
   */
  static readonly GetCustomerByPanPath = '/api/customer/getCustomerByPAN';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCustomerByPan()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getCustomerByPan$Response(params: {
    body: PanLookupDto
  }): Observable<StrictHttpResponse<CustomerDto>> {

    const rb = new RequestBuilder(this.rootUrl, CustomerService.GetCustomerByPanPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<CustomerDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getCustomerByPan$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getCustomerByPan(params: {
    body: PanLookupDto
  }): Observable<CustomerDto> {

    return this.getCustomerByPan$Response(params).pipe(
      map((r: StrictHttpResponse<CustomerDto>) => r.body as CustomerDto)
    );
  }

  /**
   * Path part for operation registerNewCustomer
   */
  static readonly RegisterNewCustomerPath = '/api/customer/registerNewCustomer';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registerNewCustomer()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registerNewCustomer$Response(params: {
    body: NewCustomerDto
  }): Observable<StrictHttpResponse<ApiResponse>> {

    const rb = new RequestBuilder(this.rootUrl, CustomerService.RegisterNewCustomerPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ApiResponse>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registerNewCustomer$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registerNewCustomer(params: {
    body: NewCustomerDto
  }): Observable<ApiResponse> {

    return this.registerNewCustomer$Response(params).pipe(
      map((r: StrictHttpResponse<ApiResponse>) => r.body as ApiResponse)
    );
  }

  /**
   * Path part for operation authenticateCustomer
   */
  static readonly AuthenticateCustomerPath = '/api/customer/authenticateCustomer';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `authenticateCustomer()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  authenticateCustomer$Response(params: {
    body: CustomerLoginDto
  }): Observable<StrictHttpResponse<AuthenticatedCustomerDto>> {

    const rb = new RequestBuilder(this.rootUrl, CustomerService.AuthenticateCustomerPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<AuthenticatedCustomerDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `authenticateCustomer$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  authenticateCustomer(params: {
    body: CustomerLoginDto
  }): Observable<AuthenticatedCustomerDto> {

    return this.authenticateCustomer$Response(params).pipe(
      map((r: StrictHttpResponse<AuthenticatedCustomerDto>) => r.body as AuthenticatedCustomerDto)
    );
  }

  /**
   * Path part for operation deleteAllEntries
   */
  static readonly DeleteAllEntriesPath = '/api/customer/deleteAllEntries';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteAllEntries()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteAllEntries$Response(params?: {
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, CustomerService.DeleteAllEntriesPath, 'post');
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
   * To access the full response (for headers, for example), `deleteAllEntries$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteAllEntries(params?: {
  }): Observable<boolean> {

    return this.deleteAllEntries$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

}
