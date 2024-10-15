import {TestBed} from '@angular/core/testing';

import {NgwWindowPlacementService} from './ngw-window-placement.service';

describe('NgwWindowPlacementService', () => {
  let service: NgwWindowPlacementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgwWindowPlacementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set size', () => {
    service.setWH(100, 200);
    expect([
      service.width(),
      service.height()
    ])
      .toEqual([100, 200]);
  });

  it('should set offset', () => {
    service.setOffset(100, 200);
    expect([
      service.offsetX(),
      service.offsetY()
    ])
      .toEqual([100, 200]);
  });

  it('should set size and offset', () => {
    service.setAll(100, 200, 300, 400);
    expect([
      service.width(),
      service.height(),
      service.offsetX(),
      service.offsetY()
    ])
      .toEqual([100, 200, 300, 400]);
  });

  it('should set size and offset, then get placement object', () => {
    service.setAll(100, 200, 300, 400);
    expect(
      service.getPlacementObject()
    )
      .toEqual({
        width: 100,
        height: 200,
        offsetX: 300,
        offsetY: 400
      });
  });
});
