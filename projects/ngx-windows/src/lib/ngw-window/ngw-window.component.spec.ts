import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActiveNgwWindowProps} from "../models/ngw-window-properties.model";
import {Component, input, NgZone} from "@angular/core";
import {NgwWindowControllerService} from "./services/ngw-window-controller.service";
import {NgwWindowsContainerComponent} from "../ngw-windows-container/ngw-windows-container.component";
import {NgwWindowsManagerService} from "../ngw-windows-manager.service";

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

@Component({
  selector: 'app-test-parent',
  standalone: true,
  imports: [
    NgwWindowsContainerComponent
  ],
  providers: [
    NgwWindowsManagerService
  ],
  template: '<ngw-windows-container/>',
  styles: ''
})
export class TestParentComponent {
  constructor(public manager: NgwWindowsManagerService) {
  }
}

describe('NgwWindowComponent', () => {
  let fixture: ComponentFixture<TestParentComponent>,
    zone: NgZone,
    win: ActiveNgwWindowProps,
    winElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestParentComponent],
    })
      .compileComponents();
    fixture = TestBed.createComponent(TestParentComponent);
    zone = TestBed.inject(NgZone)
    fixture.autoDetectChanges(true);
    win = fixture.componentInstance.manager.createWindow({
      name: 'Test window',
      component: TestWinComponent
    });
    zone.run(() => {
      fixture.detectChanges();
    });
    await fixture.whenRenderingDone();
    winElement = fixture.nativeElement.children[0]!.children[0];
  });

  it('should create', () => {
    expect(win).toBeTruthy();
  });

  it('should contain topbar by default', () => {
    expect(
      winElement.querySelector('.ngw-window-topbar')
    )
      .toBeTruthy();
  });

  it('should contain content', () => {
    expect(
      winElement.querySelector('.ngw-window-content')
    )
      .toBeTruthy();
  });

  it('should contain title by default', () => {
    expect(
      winElement.querySelector('.ngw-window-title')
    )
      .toBeTruthy();
  });

  it('should contain right controls by default', () => {
    expect(
      winElement.querySelector('.ngw-window-right-controls')
    )
      .toBeTruthy();
  });

  it('should contain left controls', async () => {
    win.service!.configurationSvc.setProperty('showLeftControls', true);
    await fixture.whenRenderingDone();
    expect(
      winElement.querySelector('.ngw-window-left-controls')
    )
      .toBeTruthy();
  });

  it('should contain close icon by default', () => {
    expect(
      winElement.querySelector('ngw-icon[type="close"]')
    )
      .toBeTruthy();
  });

  it('should contain minimize icon by default', () => {
    expect(
      winElement.querySelector('ngw-icon[type="minimize"]')
    )
      .toBeTruthy();
  });

  it('should contain maximize icon by default', () => {
    expect(
      winElement.querySelector('ngw-icon[ng-reflect-type="maximize"]')
    )
      .toBeTruthy();
  });

  it('should contain app-test-win in content', () => {
    expect(
      winElement.querySelector('.ngw-window-content app-test-win')
    )
      .toBeTruthy();
  });

  it('should move', async () => {
    let movingChanged: boolean;
    window.innerWidth = 1000;
    window.innerHeight = 1000;
    win.service!.placementSvc.setAll(300, 300, 100, 100);
    winElement.dispatchEvent(new MouseEvent('mousedown', {clientX: 110, clientY: 110}));
    await fixture.whenRenderingDone();
    movingChanged = winElement.classList.contains('moving')
    for (let i = 0; i <= 50; i += 5) {
      window.dispatchEvent(new MouseEvent('mousemove', {clientX: 110 + i, clientY: 110 + i}));
      await fixture.whenRenderingDone();
    }
    window.dispatchEvent(new MouseEvent('mouseup', {clientX: 160, clientY: 160}));
    await fixture.whenRenderingDone();
    movingChanged = movingChanged
      && !winElement.classList.contains('moving');
    expect(
      movingChanged
      && (win.service!.placementSvc.offsetX() === 150)
      && (win.service!.placementSvc.offsetY() === 150)
      && (win.service!.placementSvc.width() === 300)
      && (win.service!.placementSvc.height() === 300)
    )
      .toBe(true);
  });

  it('should resize', async () => {
    let resizingChanged: boolean;
    window.innerWidth = 1000;
    window.innerHeight = 1000;
    win.service!.placementSvc.setAll(300, 300, 100, 100);
    winElement.dispatchEvent(new MouseEvent('mousedown', {clientX: 400, clientY: 400}));
    await fixture.whenRenderingDone();
    resizingChanged = winElement.classList.contains('resizing')
    for (let i = 0; i <= 50; i += 5) {
      window.dispatchEvent(new MouseEvent('mousemove', {clientX: 400 + i, clientY: 400 + i}));
      await fixture.whenRenderingDone();
    }
    window.dispatchEvent(new MouseEvent('mouseup', {clientX: 450, clientY: 450}));
    await fixture.whenRenderingDone();
    resizingChanged = resizingChanged
      && !winElement.classList.contains('resizing');
    expect(
      resizingChanged
      && (win.service!.placementSvc.offsetX() === 100)
      && (win.service!.placementSvc.offsetY() === 100)
      && (win.service!.placementSvc.width() === 350)
      && (win.service!.placementSvc.height() === 350)
    )
      .toBe(true);
  });

  it('should maximize', async () => {
    const maximizeIcon = winElement.querySelector('ngw-icon[ng-reflect-type="maximize"]')!;
    maximizeIcon.dispatchEvent(new MouseEvent('click'));
    await fixture.whenRenderingDone();
    expect(
      win.service!.stateSvc.maximized()
      && maximizeIcon.getAttribute('ng-reflect-type') === 'restore'
    )
      .toBe(true);
  });

  it('should minimize', async () => {
    winElement.querySelector('ngw-icon[type="minimize"]')!
      .dispatchEvent(new MouseEvent('click'));
    await fixture.whenRenderingDone();
    expect(
      win.service!.stateSvc.minimized()
    )
      .toBe(true);
  });

  it('should close', async () => {
    winElement.querySelector('ngw-icon[type="close"]')!
      .dispatchEvent(new MouseEvent('click'));
    await fixture.whenRenderingDone();
    expect(
      fixture.componentInstance.manager.activeWindows()
    )
      .toEqual([]);
  });

  it('should close prevention trigger onClose$', async () => {
    win.service!.configurationSvc.setProperty('preventClose', true);
    const onCloseSpy = jasmine.createSpyObj('Subject', ['next', 'complete']);
    win.service!.onClose$ = onCloseSpy;
    winElement.querySelector('ngw-icon[type="close"]')!
      .dispatchEvent(new MouseEvent('click'));
    await fixture.whenRenderingDone();
    expect(
      onCloseSpy.next
    )
      .toHaveBeenCalled();
  });

  it('should set style width', async () => {
    win.service!.placementSvc.setWH(400, 400);
    await fixture.whenRenderingDone();
    expect(
      winElement.style.width
    )
      .toBe('400px');
  });

  it('should set style height', async () => {
    win.service!.placementSvc.setWH(400, 400);
    await fixture.whenRenderingDone();
    expect(
      winElement.style.height
    )
      .toBe('400px');
  });

  it('should set style left', async () => {
    win.service!.placementSvc.setOffset(100, 100);
    await fixture.whenRenderingDone();
    expect(
      winElement.style.left
    )
      .toBe('100px');
  });

  it('should set style top', async () => {
    win.service!.placementSvc.setOffset(100, 100);
    await fixture.whenRenderingDone();
    expect(
      winElement.style.top
    )
      .toBe('100px');
  });

  it('should set class focused', async () => {
    winElement.dispatchEvent(new MouseEvent('click'));
    await fixture.whenRenderingDone();
    expect(
      winElement.classList.contains('focused')
    )
      .toBe(true);
  });

  it('should set class locked', async () => {
    win.service!.stateSvc.locked.set(true);
    await fixture.whenRenderingDone();
    expect(
      winElement.classList.contains('locked')
    )
      .toBe(true);
  });

  it('should set class borderless', async () => {
    win.service!.configurationSvc.setProperty('borderless', true);
    await fixture.whenRenderingDone();
    expect(
      winElement.classList.contains('borderless')
    )
      .toBe(true);
  });

  it('should set class noshadow', async () => {
    win.service!.configurationSvc.setProperty('noShadow', true);
    await fixture.whenRenderingDone();
    expect(
      winElement.classList.contains('noshadow')
    )
      .toBe(true);
  });

  it('should set class transparent', async () => {
    win.service!.configurationSvc.setProperty('transparent', true);
    await fixture.whenRenderingDone();
    expect(
      winElement.classList.contains('transparent')
    )
      .toBe(true);
  });

  it('should set style background', async () => {
    win.service!.configurationSvc.setProperty('background', 'rgb(255, 0, 0)');
    await fixture.whenRenderingDone();
    expect(
      winElement.style.background
    )
      .toBe('rgb(255, 0, 0)');
  });

  it('should set style backdrop-filter', async () => {
    win.service!.configurationSvc.setProperty('backdropFilter', 'blur(2px)');
    await fixture.whenRenderingDone();
    expect(
      winElement.style.backdropFilter
    )
      .toBe('blur(2px)');
  });

  it('should set class over-resizing-point', async () => {
    win.service!.placementSvc.setAll(300, 300, 100, 100);
    winElement.dispatchEvent(new MouseEvent('mousemove', {clientX: 400, clientY: 400}));
    await fixture.whenRenderingDone();
    expect(
      winElement.classList.contains('over-resizing-point')
    )
      .toBe(true);
  });

  it('should set class fullscreen', async () => {
    win.service!.configurationSvc.setProperty('allowPlacementAlignment', true);
    window.innerWidth = 1000;
    window.innerHeight = 1000;
    win.service!.placementSvc.setAll(300, 300, 100, 100);
    winElement.dispatchEvent(new MouseEvent('mousedown', {clientX: 110, clientY: 110}));
    await fixture.whenRenderingDone();
    window.dispatchEvent(new MouseEvent('mousemove', {clientX: 500, clientY: 10}));
    await fixture.whenRenderingDone();
    window.dispatchEvent(new MouseEvent('mouseup', {clientX: 500, clientY: 10}));
    await fixture.whenRenderingDone();
    expect(
      winElement.classList.contains('fullscreen')
      && (win.service!.placementSvc.offsetX() === 0)
      && (win.service!.placementSvc.offsetY() === 0)
      && (win.service!.placementSvc.width() === 1000)
      && (win.service!.placementSvc.height() === 1000)
    )
      .toBe(true);
  });
});
