import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoWithAuthComponent } from './video-with-auth.component';

describe('VideoWithAuthComponent', () => {
  let component: VideoWithAuthComponent;
  let fixture: ComponentFixture<VideoWithAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoWithAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoWithAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
