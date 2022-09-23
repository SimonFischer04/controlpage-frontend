import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopAutomationFunctionSelectComponent } from './desktop-automation-function-select.component';

describe('DesktopAutomationFunctionSelectComponent', () => {
  let component: DesktopAutomationFunctionSelectComponent;
  let fixture: ComponentFixture<DesktopAutomationFunctionSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopAutomationFunctionSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesktopAutomationFunctionSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
