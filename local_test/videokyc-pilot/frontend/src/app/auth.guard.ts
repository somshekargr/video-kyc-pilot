import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AppURL } from "./app.url";
import { TokenType } from "./models/token-type";
import { AuthenticationService } from "./services/authentication.service";
import { TokenService } from "./services/token.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private tokenService: TokenService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.authenticationService.isLoggedIn) {
      // not logged in so redirect to login page with the return url

      if (route.routeConfig.path == AppURL.QueueBoard) {
        this.router.navigate([AppURL.AgentLogin]);
        return false;
      }

      this.router.navigate([AppURL.Customer]);
      return false;
    }


    const currentUser = this.authenticationService.currentUserValue;
    if (this.tokenService.tokenType(currentUser.token) == TokenType.AgentToken) {

    } else {

    }

    return true;
  }
}
