import {
  AfterViewInit,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  input,
  signal,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {NgComponentOutlet, NgTemplateOutlet} from "@angular/common";
import {IconComponent} from "../icon/icon.component";
import {NgwWindowsManagerService} from "../ngw-windows-manager.service";
import {fromEvent, ReplaySubject, Subscription, takeUntil, throttleTime} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {WindowPlacements} from "../models/placement.model";
import {NgwWindowControllerService} from "./services/ngw-window-controller.service";
import {NgwWindowPlacementService} from "./services/ngw-window-placement.service";
import {NgwWindowStateService} from "./services/ngw-window-state.service";
import {NgwWindowConfigurationService} from "./services/ngw-window-configuration.service";
import {NgwWindowProps} from "../models/ngw-window-properties.model";

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
  properties = input.required<NgwWindowProps>();
  initialized = signal<boolean>(false);
  topbar?: ElementRef;
  configurationSvc = inject(NgwWindowConfigurationService);
  placementSvc = inject(NgwWindowPlacementService);
  stateSvc = inject(NgwWindowStateService);
  private isResizing = false;
  private isMoving = false;
  private mouseMoveListener: Subscription | undefined;
  private isOverResizingPoint: boolean = false;

  constructor(public nwm: NgwWindowsManagerService,
              private el: ElementRef,
              private destroyRef: DestroyRef,
              public windowControllerService: NgwWindowControllerService) {
    effect(() => {
      this.windowControllerService.properties.set(
        this.properties()
      );
    }, {allowSignalWrites: true});
    effect(() => {
      const id = this.windowControllerService.id();
      this.initialized.set(
        !!id
      );
      if (id) {
        this.nwm.registerWindow(id, this.windowControllerService);
      }
    }, {allowSignalWrites: true});
  }

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

  get getContentHeight(): string {
    if (this.topbar?.nativeElement) {
      return (this.placementSvc.height() - this.topbar.nativeElement.clientHeight) + 'px'
    }
    return this.height;
  }

  @HostListener('click') activate() {
    if (this.stateSvc.focused() || this.stateSvc.locked()) return;
    this.nwm.activateWindow(this.windowControllerService.id());
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
            && this.windowControllerService.isOverResizingPoint(ev.clientX, ev.clientY);
          const startX = ev.clientX - this.placementSvc.offsetX(),
            startY = ev.clientY - this.placementSvc.offsetY();
          if (this.isResizing) {
            this.mouseMoveListener = this.activateResizeEvent();
            this.activateMouseUpEvent();
            return;
          }
          if (!this.topbar?.nativeElement) return;
          this.isMoving = this.configurationSvc.moveable()
            && (ev.clientY < this.placementSvc.offsetY() + this.topbar.nativeElement.clientHeight);
          if (this.isMoving) {
            this.mouseMoveListener = this.activateMoveEvent(startX, startY);
            this.activateMouseUpEvent();
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
            && this.windowControllerService.isOverResizingPoint(ev.clientX, ev.clientY);
        }
      });
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
          this.windowControllerService.moveWindow(
            ev.clientX - startX,
            ev.clientY - startY
          );
          if (this.configurationSvc.allowPlacementAlignment()) {
            const placementMode = this.windowControllerService.getPlacementMode(
              ev.clientX,
              ev.clientY
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
          this.windowControllerService.resizeWindow(
            ev.clientX - this.placementSvc.offsetX(),
            ev.clientY - this.placementSvc.offsetY()
          );
          ev.preventDefault();
          ev.stopPropagation();
          ev.stopImmediatePropagation();
        }
      });
  }

  private activateMouseUpEvent() {
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
              this.windowControllerService.doNgwWindowPlacementIfPossible(
                ev.clientX,
                ev.clientY
              );
            }
          }
          this.mouseMoveListener!.unsubscribe();
          doStop();
        }
      });
  }

  stopEv(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
    ev.stopImmediatePropagation();
  }
}
