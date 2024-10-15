import {TestBed, waitForAsync} from '@angular/core/testing';
import {NgwWindowsManagerService} from './ngw-windows-manager.service';
import {Component, input} from '@angular/core';
import {NgwWindowControllerService} from "ngx-windows";

@Component({
  selector: 'app-test-win',
  standalone: true,
  imports: [],
  template: '<span>Test window works!</span>',
  styles: ''
})
export class TestWinComponent {
  windowController = input.required<NgwWindowControllerService>();
}

describe('NgwWindowsManagerService', () => {
  let service: NgwWindowsManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgwWindowsManagerService);
  });

  const createWin = () => {
    return service.createWindow({
      name: 'Test Window',
      component: TestWinComponent
    });
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a window', () => {
    let win = createWin();
    expect(win.id).toBeTruthy();
  });

  it('should have window registered', waitForAsync(() => {
    spyOn(service, 'createWindow').and.callThrough();
    let win = createWin();
    win.onRegister$
      .subscribe({
        next: svc => {
          expect(svc.id()).toBeTruthy();
        },
        error: () => fail('Expected a service')
      });
    expect(service.createWindow).toHaveBeenCalled();
  }));

  it('should remove window after creation', waitForAsync(() => {
    let win = createWin();
    service.removeWindow(win.id);
    expect(service.activeWindows()).toEqual([]);
  }));

  it('should filter windows by name and find test win', () => {
    let win = createWin();
    expect(service.filterWindowsByName('Test')).toContain(win);
  });

  it('should filter windows by name and don\'t find test win', () => {
    createWin();
    expect(service.filterWindowsByName('Example')).toEqual([]);
  });

  it('should get test win by id', () => {
    let win = createWin();
    expect(service.getWindowById(win.id)).toBe(win);
  });

  it('should return undefined on unknown window id', () => {
    createWin();
    expect(service.getWindowById('aaaa')).toBeFalsy();
  });

  it('main window should be in open list', () => {
    let win = createWin();
    expect(service.getOpenWindows()).toContain(win);
  });

  it('main window should be in maximized list', waitForAsync(() => {
    spyOn(service, 'createWindow').and.callThrough();
    let win = createWin();
    win.onRegister$
      .subscribe({
        next: svc => {
          svc.toggleMaximize();
          expect(service.getMaximizedWindows()).toContain(win);
        },
        error: () => fail('Expected a service')
      });
    expect(service.createWindow).toHaveBeenCalled();
  }));

  it('main window should be in minimized list', waitForAsync(() => {
    spyOn(service, 'createWindow').and.callThrough();
    let win = createWin();
    win.onRegister$
      .subscribe({
        next: svc => {
          svc.minimize();
          expect(service.getMinimizedWindows()).toContain(win);
        },
        error: () => fail('Expected a service')
      });
    expect(service.createWindow).toHaveBeenCalled();
  }));

  it('main window should be activated', waitForAsync(() => {
    spyOn(service, 'createWindow').and.callThrough();
    let win = createWin();
    service.activateWindow(win.id);
    win.onRegister$
      .subscribe({
        next: svc => {
          expect(service.getActiveWindow()).toBe(win);
        },
        error: () => fail('Expected a service')
      });
    expect(service.createWindow).toHaveBeenCalled();
  }));

  it('main window should be not activated', waitForAsync(() => {
    spyOn(service, 'createWindow').and.callThrough();
    let win = createWin();
    service.activateWindow(win.id);
    win.onRegister$
      .subscribe({
        next: svc => {
          service.deactivateCurrentActiveWindow();
          expect(service.getActiveWindow()).toBeFalsy();
        },
        error: () => fail('Expected a service')
      });
    expect(service.createWindow).toHaveBeenCalled();
  }));

  it('all windows should be removed', () => {
    createWin();
    createWin();
    createWin();
    service.removeAllWindows();
    expect(service.activeWindows()).toEqual([]);
  });
});
