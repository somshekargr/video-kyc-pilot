import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoWithAuthComponent implements OnInit {

  constructor() { }

  @Input() src: string;

  async ngOnInit(): Promise<void> {
  }
}
