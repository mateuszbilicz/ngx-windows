import { TestBed } from '@angular/core/testing';

import { NgxWindowsService } from './ngx-windows.service';

describe('NgxWindowsService', () => {
  let service: NgxWindowsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxWindowsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
