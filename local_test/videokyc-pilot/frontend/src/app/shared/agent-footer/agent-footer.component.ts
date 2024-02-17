import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'agent-footer',
  templateUrl: './agent-footer.component.html'
})
export class AgentFooterComponent implements OnInit {

  copyRightYear: number = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
  }

}
