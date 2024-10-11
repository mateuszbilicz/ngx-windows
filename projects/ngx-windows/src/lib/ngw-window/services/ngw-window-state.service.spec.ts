import {TestBed} from '@angular/core/testing';

import {NgwWindowStateService} from './ngw-window-state.service';

describe('NgwWindowStateService', () => {
  let service: NgwWindowStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgwWindowStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
