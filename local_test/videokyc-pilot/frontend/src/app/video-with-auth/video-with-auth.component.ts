import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-with-auth',
  templateUrl: './video-with-auth.component.html',
  styleUrls: ['./video-with-auth.component.css']
})
export class VideoWithAuthComponent implements OnInit {

  constructor() { }

  @Input() src: string;

  async ngOnInit(): Promise<void> {
  }
}
