import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionFieldRenderComponent } from './action-field-render.component';

describe('ActionFieldRenderComponent', () => {
  let component: ActionFieldRenderComponent;
  let fixture: ComponentFixture<ActionFieldRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionFieldRenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionFieldRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
