import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundImageRendererComponent } from './background-image-renderer.component';

describe('BackgroundImageRendererComponent', () => {
  let component: BackgroundImageRendererComponent;
  let fixture: ComponentFixture<BackgroundImageRendererComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackgroundImageRendererComponent]
    });
    fixture = TestBed.createComponent(BackgroundImageRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
