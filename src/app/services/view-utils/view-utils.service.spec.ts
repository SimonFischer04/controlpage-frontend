import { TestBed } from '@angular/core/testing';

import { ViewUtilsService } from './view-utils.service';

describe('ViewUtilsService', () => {
  let service: ViewUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
