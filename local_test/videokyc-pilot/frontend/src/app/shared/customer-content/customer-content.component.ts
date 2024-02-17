import { Component, OnDestroy, OnInit } from '@angular/core';
@Component({
  selector: 'customer-content',
  templateUrl: './customer-content.component.html'
})
export class CustomerContentComponent implements OnInit, OnDestroy {
  today: Date = new Date();

  copyRightYear = this.today.getFullYear();

  constructor(
  ) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}