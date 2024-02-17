import { Component, OnInit } from '@angular/core';
import { AppURL } from 'src/app/app.url';

@Component({
  selector: 'agent-sidebar',
  templateUrl: './agent-sidebar.component.html'
})
export class AgentSidebarComponent implements OnInit {
  AppURL = AppURL;
  constructor() { }

  ngOnInit(): void {
    this.AppURL.QueueBoard
  }

  logout() {
  }
}
