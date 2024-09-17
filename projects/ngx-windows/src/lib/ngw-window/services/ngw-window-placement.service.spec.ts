import { TestBed } from '@angular/core/testing';

import { NgwWindowPlacementService } from './ngw-window-placement.service';

describe('NgwWindowPlacementService', () => {
  let service: NgwWindowPlacementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgwWindowPlacementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
