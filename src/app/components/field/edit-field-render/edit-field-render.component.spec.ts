import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFieldRenderComponent } from './edit-field-render.component';

describe('EditFieldRenderComponent', () => {
  let component: EditFieldRenderComponent;
  let fixture: ComponentFixture<EditFieldRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFieldRenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFieldRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
