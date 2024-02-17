import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from '../api/services/user.service';
import { AuthenticatedUserDto } from '../api/models/authenticated-user-dto';
import { AuthenticatedCustomerDto } from '../api/models/authenticated-customer-dto';
import { CustomerService } from '../api/services';
import { AppURL } from '../app.url';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<AuthenticatedUserDto | AuthenticatedCustomerDto>;
  public currentUser: Observable<AuthenticatedUserDto | AuthenticatedCustomerDto>;

  constructor(private userService: UserService, private customerService: CustomerService) {
    let userFromLS: any = null;

    let agentUrs = ['/queue-board', '/agent-login', '/audits', "/agent-dashboard"];
    let customerUrs = ['/customer'];

    let userStr = null;

    if (agentUrs.includes(location.pathname)) {
      //agent url
      userStr = localStorage.getItem('agentUser');
    }

    if (customerUrs.includes(location.pathname)) {
      //customer url
      userStr = localStorage.getItem('customerUser');
    }


    if (userStr) {
      try {
        userFromLS = JSON.parse(userStr);
      } catch {
        // Do nothing. Probably invalid JSON
      }
    }

    this.currentUserSubject = new BehaviorSubject<AuthenticatedUserDto | AuthenticatedCustomerDto>(userFromLS);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): AuthenticatedUserDto | AuthenticatedCustomerDto {
    return this.currentUserSubject.value;
  }

  public get isLoggedIn(): boolean {
    if (!this.currentUserValue)
      return false;
    return this.isTokenValid;
  }

  private ensureTokenDecoded() {
    if (this._token !== null || this.currentUserValue == null) return;

    this._token = jwt_decode(this.currentUserValue.token);
  }

  private _token: any = null;

  public get isTokenValid(): boolean {
    this.ensureTokenDecoded();

    if (this._token !== null) {
      const notBefore = new Date(this._token.iat * 1000);
      const notAfter = new Date(this._token.exp * 1000);

      const curDateTime = new Date();

      return (curDateTime > notBefore && curDateTime < notAfter);
    }

    return false;
  }

  async authenticateUser(username: string, password: string) {
    const user = await this.userService.authenticateUser({
      body: { username, password }
    }).toPromise();

    this.setUserToken(user);

    return user;
  }

  async authenticateCustomer(panNumber: string, phone: string) {
    const user = await this.customerService.authenticateCustomer({
      body: { panNumber, phone }
    }).toPromise();

    this.setUserToken(user);

    return user;
  }

  setUserToken(user: any) {
    // login successful if there's a jwt token in the response
    if (user && user.token) {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('agentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
    }
  }

  setCustomerToken(customer: any) {
    // login successful if there's a jwt token in the response
    if (customer && customer.token) {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('customerUser', JSON.stringify(customer));
      this.currentUserSubject.next(customer);
    }
  }

  customerLogout(router: Router | null) {
    // remove user from local storage to log user out
    localStorage.removeItem('customerUser');

    let nullObject: any = null;

    this.currentUserSubject.next(nullObject);

    if (router)
      router.navigate([AppURL.Customer]);
  }

  agentLogout(router: Router | null) {
    // remove user from local storage to log user out
    localStorage.removeItem('agentUser');

    let nullObject: any = null;

    this.currentUserSubject.next(nullObject);

    if (router)
      router.navigate([AppURL.AgentLogin]);
  }
}
