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

import { AuthenticatedUserDto } from '../models/authenticated-user-dto';
import { NewUserDto } from '../models/new-user-dto';
import { UserDto } from '../models/user-dto';
import { UserLoginDto } from '../models/user-login-dto';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation registerNewUser
   */
  static readonly RegisterNewUserPath = '/api/user/registerNewUser';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `registerNewUser()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registerNewUser$Response(params: {
    body: NewUserDto
  }): Observable<StrictHttpResponse<UserDto>> {

    const rb = new RequestBuilder(this.rootUrl, UserService.RegisterNewUserPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<UserDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `registerNewUser$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  registerNewUser(params: {
    body: NewUserDto
  }): Observable<UserDto> {

    return this.registerNewUser$Response(params).pipe(
      map((r: StrictHttpResponse<UserDto>) => r.body as UserDto)
    );
  }

  /**
   * Path part for operation authenticateUser
   */
  static readonly AuthenticateUserPath = '/api/user/authenticateUser';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `authenticateUser()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  authenticateUser$Response(params: {
    body: UserLoginDto
  }): Observable<StrictHttpResponse<AuthenticatedUserDto>> {

    const rb = new RequestBuilder(this.rootUrl, UserService.AuthenticateUserPath, 'post');
    if (params) {
      rb.body(params.body, 'application/json');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json'
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<AuthenticatedUserDto>;
      })
    );
  }

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `authenticateUser$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  authenticateUser(params: {
    body: UserLoginDto
  }): Observable<AuthenticatedUserDto> {

    return this.authenticateUser$Response(params).pipe(
      map((r: StrictHttpResponse<AuthenticatedUserDto>) => r.body as AuthenticatedUserDto)
    );
  }

  /**
   * Path part for operation deleteAllEntries_1
   */
  static readonly DeleteAllEntries_1Path = '/api/user/deleteAllEntries';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteAllEntries_1()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteAllEntries_1$Response(params?: {
  }): Observable<StrictHttpResponse<boolean>> {

    const rb = new RequestBuilder(this.rootUrl, UserService.DeleteAllEntries_1Path, 'post');
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
   * To access the full response (for headers, for example), `deleteAllEntries_1$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteAllEntries_1(params?: {
  }): Observable<boolean> {

    return this.deleteAllEntries_1$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

}
