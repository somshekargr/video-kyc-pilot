import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TokenService } from 'src/app/services/token.service';
import { AppURL } from '../../app.url';
@Component({
  selector: 'agent-navbar',
  templateUrl: './agent-navbar.component.html'
})
export class AgentNavbarComponent implements OnInit {
  AppURL = AppURL;
  agentUserName: string = "Agent User";

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authenticationService: AuthenticationService,
    private tokenService: TokenService) { }

  ngOnInit(): void {
    if (this.authenticationService.currentUserValue) {
      const currentUser = this.tokenService.decodeAsUserDto(this.authenticationService.currentUserValue.token);
      this.agentUserName = currentUser.name || "Agent User";
    }
  }

  toggleCollapse() {
    if (this.document.body.classList.contains("sidebar-mini")) {
      this.document.body.classList.remove("sidebar-mini");
    } else {
      this.document.body.classList.add("sidebar-mini");
    }
  }
}
