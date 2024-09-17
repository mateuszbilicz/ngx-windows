import {
  AfterViewInit,
  Component, DestroyRef,
  ElementRef,
  HostBinding,
  HostListener, inject, input,
  Input, signal,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {NgwWindowProperties} from "../models/ngw-window-properties.model";
import {NgComponentOutlet, NgTemplateOutlet} from "@angular/common";
import {IconComponent} from "../icon/icon.component";
import {NgwWindowsManagerService} from "../ngw-windows-manager.service";
import {distance2D} from "../api/ngw-window-util";
import {moveNgwWindow, doNgwWindowPlacementIfPossible, resizeNgwWindow} from "../api/ngw-windows.api";
import {fromEvent, ReplaySubject, Subscription, takeUntil, throttleTime} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {getWindowPlacement} from "../api/ngw-window-placement.api";
import {WindowPlacements} from "../models/placement.model";
import {NgwWindowControllerService} from "./services/ngw-window-controller.service";
import {NgwWindowPlacementService} from "./services/ngw-window-placement.service";
import {NgwWindowStateService} from "./services/ngw-window-state.service";
import {NgwWindowConfigurationService} from "./services/ngw-window-configuration.service";

@Component({
  selector: 'ngw-window',
  standalone: true,
  imports: [
    NgComponentOutlet,
    IconComponent,
    NgTemplateOutlet
  ],
  providers: [
    NgwWindowControllerService,
    NgwWindowConfigurationService,
    NgwWindowPlacementService,
    NgwWindowStateService
  ],
  templateUrl: './ngw-window.component.html',
  styleUrl: './ngw-window.component.css',
  encapsulation: ViewEncapsulation.None
})
export class NgwWindowComponent
  implements AfterViewInit {
  properties = input.required<NgwWindowProperties>();
  initialized = signal<boolean>(false);
  private isResizing = false;
  private isMoving = false;
  private mouseMoveListener: Subscription | undefined;
  private isOverResizingPoint: boolean = false;
  topbar?: ElementRef;
  configurationSvc = inject(NgwWindowConfigurationService);
  placementSvc = inject(NgwWindowPlacementService);
  stateSvc = inject(NgwWindowStateService);

  @ViewChild('_topbar') set __topbar(e: ElementRef) {
    if (e) this.topbar = e;
  }

  @HostBinding('class.minimized') get isMinimized() {
    return this.stateSvc.minimized();
  }

  @HostBinding('class.maximized') get isMaximized() {
    return this.stateSvc.maximized();
  }

  @HostBinding('class.focused') get isFocused() {
    return this.stateSvc.focused();
  }

  @HostBinding('class.locked') get isLocked() {
    return this.stateSvc.locked();
  }

  @HostBinding('class.fullscreen') get isFullScreen() {
    return this.placementSvc.placementMode() == 'fullScreen';
  }

  @HostBinding('class.over-resizing-point') get canResize() {
    return this.isOverResizingPoint;
  }

  @HostBinding('style.width') get width() {
    return this.placementSvc.width() + 'px';
  }

  @HostBinding('style.height') get height() {
    return this.placementSvc.height() + 'px';
  }

  @HostBinding('style.left') get left() {
    return this.placementSvc.offsetX() + 'px';
  }

  @HostBinding('style.top') get top() {
    return this.placementSvc.offsetY() + 'px';
  }

  @HostBinding('class.resizing') get resizing() {
    return this.isResizing;
  }

  @HostBinding('class.moving') get moving() {
    return this.isMoving;
  }

  @HostBinding('class.borderless') get isBorderless() {
    return this.configurationSvc.borderless();
  }

  @HostBinding('class.noshadow') get hasNoShadow() {
    return this.configurationSvc.noShadow();
  }

  @HostBinding('class.transparent') get isTransparent() {
    return this.configurationSvc.transparent();
  }

  @HostBinding('style.background') get background() {
    return this.configurationSvc.background();
  }

  @HostBinding('style.backdrop-filter') get backdropFilter() {
    return this.configurationSvc.backdropFilter();
  }

  @HostListener('click') activate() {
    if (this.stateSvc.focused() || this.stateSvc.locked()) return;
    this.nwm.activateWindow(this.properties().id);
  }

  constructor(public nwm: NgwWindowsManagerService,
              private el: ElementRef,
              private destroyRef: DestroyRef,
              public windowControllerService: NgwWindowControllerService) {
    this.windowControllerService.instance = this;
  }

  private get placementDistanceTolerance() {
    return this.configurationSvc.placementDistanceTolerance() ?? 64;
  }

  private get resizeDistanceTolerance() {
    return this.configurationSvc.resizeDistanceTolerance() ?? 12;
  }

  ngAfterViewInit() {
    fromEvent(this.el.nativeElement, 'mousedown')
      .pipe(
        throttleTime(30),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (ev: any) => {
          ev = ev as MouseEvent;
          if (ev.target.closest('ngw-icon')) return;
          if (
            this.isLocked
            || !this.placementSvc.placementMode() == undefined
          ) return;
          this.activate();
          this.isResizing = this.configurationSvc.resizeable()
            && distance2D(
              ev.clientX,
              ev.clientY,
              this.placementSvc.width() + this.placementSvc.offsetX(),
              this.placementSvc.height() + this.placementSvc.offsetY()
            ) < this.resizeDistanceTolerance;
          const startX = ev.clientX - this.placementSvc.offsetX(),
            startY = ev.clientY - this.placementSvc.offsetY();
          if (this.isResizing) {
            this.mouseMoveListener = this.activateResizeEvent();
            this.activateMouseUpEvent(startX, startY);
            return;
          }
          if (!this.topbar?.nativeElement) return;
          this.isMoving = this.configurationSvc.moveable()
            && (ev.clientY < this.placementSvc.offsetY() + this.topbar.nativeElement.clientHeight);
          if (this.isMoving) {
            this.mouseMoveListener = this.activateMoveEvent(startX, startY);
            this.activateMouseUpEvent(startX, startY);
          }
        }
      })
    fromEvent(this.el.nativeElement, 'mousemove')
      .pipe(
        throttleTime(60),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (ev: any) => {
          ev = ev as MouseEvent;
          this.isOverResizingPoint = this.configurationSvc.resizeable()
            && distance2D(
              ev.clientX,
              ev.clientY,
              this.placementSvc.width() + this.placementSvc.offsetX(),
              this.placementSvc.height() + this.placementSvc.offsetY()
            ) < this.resizeDistanceTolerance;
        }
      });
    this.initialized.set(true);
  }

  private activateMoveEvent(startX: number, startY: number) {
    return fromEvent(window, 'mousemove')
      .pipe(
        throttleTime(5),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (ev: any) => {
          ev = ev as MouseEvent;
          moveNgwWindow(
            this.properties(),
            ev.clientX - startX,
            ev.clientY - startY,
            window.innerWidth,
            window.innerHeight
          );
          if (this.configurationSvc.allowPlacementAlignment()) {
            const placementMode = getWindowPlacement(
              ev.clientX,
              ev.clientY,
              window.innerWidth,
              window.innerHeight,
              this.placementDistanceTolerance
            );
            this.nwm.onPlacementPrediction((placementMode && WindowPlacements[placementMode]) ?? undefined);
          }
          ev.preventDefault();
          ev.stopPropagation();
          ev.stopImmediatePropagation();
        }
      });
  }

  private activateResizeEvent() {
    return fromEvent(window, 'mousemove')
      .pipe(
        throttleTime(5),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (ev: any) => {
          ev = ev as MouseEvent;
          resizeNgwWindow(
            this.properties(),
            ev.clientX - this.placementSvc.offsetX(),
            ev.clientY - this.placementSvc.offsetY(),
            window.innerWidth,
            window.innerHeight
          );
          ev.preventDefault();
          ev.stopPropagation();
          ev.stopImmediatePropagation();
        }
      });
  }

  private activateMouseUpEvent(startX: number, startY: number) {
    let stop = new ReplaySubject<boolean>(1),
      doStop = () => {
        stop.next(true);
        stop.complete();
        this.nwm.onPlacementPrediction(undefined);
      };
    fromEvent(window, 'mouseup')
      .pipe(
        throttleTime(5),
        takeUntilDestroyed(this.destroyRef),
        takeUntil(stop)
      )
      .subscribe({
        next: (ev: any) => {
          ev = ev as MouseEvent;
          if (!this.isFocused) return doStop();
          this.isResizing = false;
          if (this.isMoving) {
            this.isMoving = false;
            if (this.configurationSvc.allowPlacementAlignment()) {
              doNgwWindowPlacementIfPossible(
                this.properties(),
                ev.clientX,
                ev.clientY,
                window.innerWidth,
                window.innerHeight,
                this.placementDistanceTolerance
              );
            }
          }
          this.mouseMoveListener!.unsubscribe();
          doStop();
        }
      });
  }

  get getContentHeight(): string {
    if (this.topbar?.nativeElement) {
      return (this.placementSvc.height() - this.topbar.nativeElement.clientHeight) + 'px'
    }
    return this.height;
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
      this.windowControllerService.onClose$.next(ev);
      return;
    }
    this.nwm.removeWindow(this.properties().id);
  }

}
