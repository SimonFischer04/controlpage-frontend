import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldEditSectionComponent } from './field-edit-section.component';

describe('FieldEditSectionComponent', () => {
  let component: FieldEditSectionComponent;
  let fixture: ComponentFixture<FieldEditSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldEditSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldEditSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
