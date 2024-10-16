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

  it('could set minimized', () => {
    service.minimized.set(true);
    expect(service.minimized()).toBe(true);
  });

  it('could set maximized', () => {
    service.maximized.set(true);
    expect(service.maximized()).toBe(true);
  });

  it('could set focused', () => {
    service.focused.set(true);
    expect(service.focused()).toBe(true);
  });

  it('could set locked', () => {
    service.locked.set(true);
    expect(service.locked()).toBe(true);
  });
});
