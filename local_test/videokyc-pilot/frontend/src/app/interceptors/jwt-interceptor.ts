import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent
} from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "../services/authentication.service";
import { ApiConfiguration } from "../api/api-configuration";
import { environment } from "../../environments/environment";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private authenticationService: AuthenticationService,
    private apiConfiguration: ApiConfiguration
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (request.url.startsWith(environment.apiURL)) {
      // add auth header with jwt if user is logged in and request is to api url
      const currentUser = this.authenticationService.currentUserValue;
      const isLoggedIn = currentUser && currentUser.token;

      if (isLoggedIn) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${currentUser.token}`
          }
        });
      }
    }

    return next.handle(request);
  }
}
