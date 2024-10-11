import {TestBed} from '@angular/core/testing';

import {NgwWindowsManagerService} from './ngw-windows-manager.service';

describe('NgwWindowsManagerService', () => {
  let service: NgwWindowsManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgwWindowsManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
