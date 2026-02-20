import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {NgwWindowsManagerService} from './ngw-windows-manager.service';
import {Component, input} from '@angular/core';
import {NgwWindowsContainerComponent} from "./ngw-windows-container/ngw-windows-container.component";
import {NgwWindowControllerService} from "./ngw-window/services/ngw-window-controller.service";

@Component({
  selector: 'app-test-win',
  imports: [],
  template: '<span>Test window works!</span>',
  styles: ''
})
export class TestWinComponent {
  windowController = input.required<NgwWindowControllerService>();
}

@Component({
  selector: 'app-test-parent',
  imports: [
    NgwWindowsContainerComponent
  ],
  template: '<ngw-windows-container/>',
  styles: ''
})
export class TestParentComponent {
  constructor(public manager: NgwWindowsManagerService) {
  }
}

describe('NgwWindowsManagerService', () => {
  let service: NgwWindowsManagerService,
    fixture: ComponentFixture<TestParentComponent>,

    beforeEach
  (() => {
    TestBed.configureTestingModule({
      imports: [TestParentComponent]
    });
    fixture = TestBed.createComponent(TestParentComponent);
    service = TestBed.inject(NgwWindowsManagerService);
    fixture.autoDetectChanges(true);
  });

  const createWin = () => {
    return service.createWindow({
      name: 'Test Window',
      component: TestWinComponent
    });
  }

  const createWinInContainer = () => {
    return fixture.componentInstance.manager.createWindow({
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

  it('should have window registered', async () => {
    const registerSpy = jasmine.createSpyObj('Subject', ['next', 'complete']);
    let win = createWinInContainer();
    win.onRegister$ = registerSpy;
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    expect(registerSpy.next).toHaveBeenCalled();
  });

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

  it('main window should be in maximized list', async () => {
    let win = createWinInContainer();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    win.service!.toggleMaximize();
    expect(
      fixture.componentInstance.manager.getMaximizedWindows()
    ).toContain(win);
  });

  it('main window should be in minimized list', async () => {
    let win = createWinInContainer();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    win.service!.toggleMaximize();
    win.service!.minimize();
    expect(
      fixture.componentInstance.manager.getMinimizedWindows()
    ).toContain(win);
  });

  it('main window should be activated', async () => {
    let win = createWinInContainer();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    fixture.componentInstance.manager!.activateWindow(win.id);
    expect(
      fixture.componentInstance.manager.getActiveWindow()
    ).toBe(win);
  });

  it('main window should be not activated', async () => {
    let win = createWinInContainer();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    fixture.componentInstance.manager!.activateWindow(win.id);
    fixture.componentInstance.manager!.deactivateCurrentActiveWindow();
    expect(
      fixture.componentInstance.manager.getActiveWindow()
    ).toBeFalsy();
  });

  it('all windows should be removed', () => {
    createWin();
    createWin();
    createWin();
    service.removeAllWindows();
    expect(service.activeWindows()).toEqual([]);
  });
});
