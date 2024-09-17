import { TestBed } from '@angular/core/testing';

import { NgwWindowConfigurationService } from './ngw-window-configuration.service';

describe('NgwWindowConfigurationService', () => {
  let service: NgwWindowConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgwWindowConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
