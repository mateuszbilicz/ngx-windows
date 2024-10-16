import {TestBed} from '@angular/core/testing';
import {NgwWindowControllerService} from './ngw-window-controller.service';
import {TestWinComponent} from "../../ngw-windows-manager.service.spec";
import {NgwWindowsManagerService} from "../../ngw-windows-manager.service";

describe('NgwWindowControllerService', () => {
  let service: NgwWindowControllerService,
    nwm: NgwWindowsManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NgwWindowControllerService,
        NgwWindowsManagerService
      ]
    });
    nwm = TestBed.inject(NgwWindowsManagerService);
    service = TestBed.inject(NgwWindowControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const createWin = () => {
    return nwm.createWindow({
      name: 'Test Window',
      component: TestWinComponent
    });
  }

  it('should move window', () => {
    service.moveWindow(100, 100);
    expect({
      offsetX: service.placementSvc.offsetX(),
      offsetY: service.placementSvc.offsetY()
    }).toEqual({
      offsetX: 100,
      offsetY: 100
    });
  });

  it('should resize window', () => {
    service.resizeWindow(300, 300);
    expect({
      width: service.placementSvc.width(),
      height: service.placementSvc.height()
    }).toEqual({
      width: 300,
      height: 300
    });
  });

  it('should set window placement to left top corner', () => {
    service.configurationSvc.setProperty('allowPlacementAlignment', true);
    service.doNgwWindowPlacementIfPossible(0, 0);
    expect(
      service.placementSvc.placementMode()
    ).toEqual(
      'cornerLeftTop'
    );
  });

  it('should be over resizing point', () => {
    service.placementSvc.setAll(100, 100, 500, 500);
    expect(
      service.isOverResizingPoint(600, 600)
    ).toBe(
      true
    );
  });

  it('should minimize window', () => {
    service.minimize();
    expect(
      service.stateSvc.minimized()
    ).toBe(
      true
    );
  });

  it('should toggle window maximize', () => {
    service.toggleMaximize();
    expect(
      service.stateSvc.maximized()
    ).toBe(
      true
    );
  });

  it('should lock window', () => {
    service.setLocked(true);
    expect(
      service.stateSvc.locked()
    ).toBe(
      true
    );
  });

  it('should close window', () => {
    spyOn(nwm, 'removeWindow').and.callThrough();
    service.close(new MouseEvent('click'));
    expect(nwm.removeWindow).toHaveBeenCalled();
  });
});
