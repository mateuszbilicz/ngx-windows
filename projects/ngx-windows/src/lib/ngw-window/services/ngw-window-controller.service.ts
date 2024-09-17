import '@angular/compiler';
import {computed, DestroyRef, Injectable, input, signal, TemplateRef} from '@angular/core';
import {NgwWindowComponent} from "../ngw-window.component";
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
export class NgwWindowControllerService {
  properties = signal<NgwWindowProps | undefined>(undefined);
  onMenu$: Subject<MouseEvent> = new Subject<MouseEvent>();
  onClose$: Subject<MouseEvent> = new Subject<MouseEvent>();
  leftControlsTemplate?: TemplateRef<any>;
  rightControlsTemplate?: TemplateRef<any>;
  windowNameTemplate?: TemplateRef<any>;
  id = computed(() => this.properties()?.id ?? '');
  name = computed(() => this.properties()?.name ?? '');
  component = computed(() => this.properties()?.component);
  data = signal<any>(undefined);

  constructor(public nwm: NgwWindowsManagerService,
              private destroyRef: DestroyRef,
              public configurationSvc: NgwWindowConfigurationService,
              public placementSvc: NgwWindowPlacementService,
              public stateSvc: NgwWindowStateService) {
  }

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

  getPlacementMode(x: number, y: number) {
    return getWindowPlacement(
      x,
      y,
      window.innerWidth,
      window.innerHeight,
      this.configurationSvc.placementDistanceTolerance()
    );
  }

  isOverResizingPoint(x: number, y: number) {
    return distance2D(
      x,
      y,
      this.placementSvc.width() + this.placementSvc.offsetX(),
      this.placementSvc.height() + this.placementSvc.offsetY()
    ) < this.configurationSvc.resizeDistanceTolerance()
  }

  minimize() {
    this.stateSvc.minimized.set(true);
  }

  toggleMaximize() {
    this.stateSvc.maximized.set(!this.stateSvc.maximized());
  }

  setLocked(locked: boolean) {
    this.stateSvc.locked.set(locked);
  }

  close(ev: MouseEvent) {
    if (this.configurationSvc.preventClose()) {
      this.onClose$.next(ev);
      return;
    }
    this.nwm.removeWindow(this.properties()?.id!);
  }

}
