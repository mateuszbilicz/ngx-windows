import {TestBed} from '@angular/core/testing';

import {NgwWindowControllerService} from './ngw-window-controller.service';

describe('NgwWindowControllerService', () => {
  let service: NgwWindowControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgwWindowControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
