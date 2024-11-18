import '@angular/compiler';
import {computed, Injectable, signal, TemplateRef} from '@angular/core';
import {Subject} from "rxjs";
import {NgwWindowConfigurationService} from "./ngw-window-configuration.service";
import {NgwWindowPlacementService} from "./ngw-window-placement.service";
import {NgwWindowStateService} from "./ngw-window-state.service";
import {NgwWindowsManagerService} from "../../ngw-windows-manager.service";
import {doNgwWindowPlacementIfPossible, moveNgwWindow, resizeNgwWindow} from "../../api/ngw-windows.api";
import {getWindowPlacement} from "../../api/ngw-window-placement.api";
import {distance2D} from "../../api/ngw-window-util";
import {NgwWindowProps} from "../../models/ngw-window-properties.model";

@Injectable({
  providedIn: 'root'
})
/**
 * @class NgwWindowControllerService
 * @description Service to control window instance. Provided in and used by NgwWindowComponent. Passed to components inside windows as windowController: InputSignal<NgwWindowControllerService>.
 */
export class NgwWindowControllerService {
  /**
   * @property properties
   * @description Window properties.
   */
  properties = signal<NgwWindowProps | undefined>(undefined);

  /**
   * @property onMenu$
   * @description Menu button click Subject.
   */
  onMenu$: Subject<MouseEvent> = new Subject<MouseEvent>();

  /**
   * @property onClose$
   * @description Window Close Subject.
   */
  onClose$: Subject<MouseEvent> = new Subject<MouseEvent>();

  /**
   * @property leftControlsTemplate
   * @description Window topbar left controls template (optional).
   * @optional
   */
  leftControlsTemplate?: TemplateRef<any>;

  /**
   * @property rightControlsTemplate
   * @description Window topbar right controls template (optional).
   * @optional
   */
  rightControlsTemplate?: TemplateRef<any>;

  /**
   * @property windowNameTemplate
   * @description Window topbar name template (optional).
   * @optional
   */
  windowNameTemplate?: TemplateRef<any>;

  /**
   * @property id
   * @description Read-only window id.
   * @readonly
   */
  id = computed(() => this.properties()?.id ?? '');

  /**
   * @property name
   * @description Read-only window name.
   * @readonly
   */
  name = computed(() => this.properties()?.name ?? '');

  /**
   * @property component
   * @description Read-only window component (app).
   * @readonly
   */
  component = computed(() => this.properties()?.component);

  /**
   * @property data
   * @description Read-only window data (any data passed to window via properties).
   */
  data = signal<any>(undefined);

  constructor(public nwm: NgwWindowsManagerService,
              public configurationSvc: NgwWindowConfigurationService,
              public placementSvc: NgwWindowPlacementService,
              public stateSvc: NgwWindowStateService) {
  }

  /**
   * @function moveWindow
   * @description Moves window with checking max/min position to user viewport. Checks minimized and maximized state, if some of them is true, then cancels execution.
   * @param x - x coordinate
   * @param y - y coordinate
   * @returns void
   */
  moveWindow(x: number, y: number) {
    moveNgwWindow(
      this.placementSvc,
      this.stateSvc,
      this.configurationSvc,
      x,
      y,
      window.innerWidth,
      window.innerHeight
    );
  }

  /**
   * @function resizeWindow
   * @description Resize window, uses window mix and max size. Cancels if window is minimized or maximized.
   * @param width - new window width
   * @param height - new window height
   * @returns void
   */
  resizeWindow(width: number, height: number) {
    resizeNgwWindow(
      this.placementSvc,
      this.stateSvc,
      width,
      height,
      window.innerWidth,
      window.innerHeight
    );
  }

  /**
   * @function doNgwWindowPlacementIfPossible
   * @description Checks possible window placement mode and if it's not "free", then applies this placement to window.
   * @param x - x coordinate
   * @param y - y coordinate
   * @returns void
   */
  doNgwWindowPlacementIfPossible(x: number, y: number) {
    doNgwWindowPlacementIfPossible(
      this.placementSvc,
      this.stateSvc,
      this.configurationSvc,
      x,
      y,
      window.innerWidth,
      window.innerHeight,
      this.configurationSvc.placementDistanceTolerance()
    );
  }

  /**
   * @function getPlacementMode
   * @description Predicts window placement mode or undefined if it's "free".
   * @param x - x coordinate
   * @param y - y coordinate
   * @returns void
   */
  getPlacementMode(x: number, y: number) {
    return getWindowPlacement(
      x,
      y,
      window.innerWidth,
      window.innerHeight,
      this.configurationSvc.placementDistanceTolerance()
    );
  }

  /**
   * @function isOverResizingPoint
   * @description Checks distance to window resizing point and returns if mouse cursor is over this point.
   * @param x - mouse x coordinate
   * @param y - mouse y coordinate
   * @returns void
   */
  isOverResizingPoint(x: number, y: number) {
    return distance2D(
      x,
      y,
      this.placementSvc.width() + this.placementSvc.offsetX(),
      this.placementSvc.height() + this.placementSvc.offsetY()
    ) < this.configurationSvc.resizeDistanceTolerance()
  }

  /**
   * @function minimize
   * @description Sets window minimized state. If current active window is focused (active), then deactivates it.
   * @returns void
   */
  minimize() {
    this.stateSvc.minimized.set(true);
    if (this.nwm.currentActiveWindow()?.id == this.id()) {
      this.nwm.deactivateCurrentActiveWindow();
    }
  }

  /**
   * @function toggleMaximize
   * @description Toggles window maximized state.
   * @returns void
   */
  toggleMaximize() {
    this.stateSvc.maximized.set(!this.stateSvc.maximized());
  }

  /**
   * @function setLocked
   * @description Sets window locked state.
   * @param locked - locked state bool
   * @returns void
   */
  setLocked(locked: boolean) {
    this.stateSvc.locked.set(locked);
  }

  /**
   * @function close
   * @description SetIf window has preventClose option then emits onClose$ Subject, else calls removeWindow.
   * @param ev - mouse event
   * @returns void
   */
  close(ev: MouseEvent) {
    if (this.configurationSvc.preventClose()) {
      this.onClose$.next(ev);
      return;
    }
    this.nwm.removeWindow(this.properties()?.id!);
  }

}
