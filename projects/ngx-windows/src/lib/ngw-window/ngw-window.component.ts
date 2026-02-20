import {
  AfterViewInit,
  ChangeDetectionStrategy,
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
  styles: '',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * @class NgwWindowComponent
 * @description Window component.
 */
export class NgwWindowComponent
  implements AfterViewInit {
  /**
   * @property properties
   * @description Window properties input.
   */
  properties = input.required<NgwWindowProps>();

  /**
   * @property initialized
   * @description Window initialized state - used for NgwWindowsManagerService.
   * @default false
   */
  initialized = signal<boolean>(false);

  /**
   * @property topbar
   * @description Window topbar element reference.
   * @default undefined
   * @optional
   */
  topbar?: ElementRef;

  /**
   * @property configurationSvc
   * @description Window configuration service.
   */
  configurationSvc = inject(NgwWindowConfigurationService);

  /**
   * @property placementSvc
   * @description Window placement service.
   */
  placementSvc = inject(NgwWindowPlacementService);

  /**
   * @property stateSvc
   * @description Window placement service.
   */
  stateSvc = inject(NgwWindowStateService);

  /**
   * @property isResizing
   * @description Window resizing state used in events to control placement.
   * @default false
   * @private
   */
  private isResizing = false;

  /**
   * @property isMoving
   * @description Window moving state used in events to control placement.
   * @default false
   * @private
   */
  private isMoving = false;

  /**
   * @property mouseMoveListener
   * @description Window mouse move event listener function.
   * @default undefined
   * @private
   */
  private mouseMoveListener: Subscription | undefined;

  /**
   * @property isOverResizingPoint
   * @description Information about mouse hovering over window resizing point.
   * @default false
   * @private
   */
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

  /**
   * @property __topbar
   * @description topbar property setter.
   */
  @ViewChild('_topbar') set __topbar(e: ElementRef) {
    if (e) this.topbar = e;
  }

  /**
   * @property isMinimized
   * @description Returns window minimized state.
   */
  @HostBinding('class.minimized') get isMinimized() {
    return this.stateSvc.minimized();
  }

  /**
   * @property isMaximized
   * @description Returns window maximized state.
   */
  @HostBinding('class.maximized') get isMaximized() {
    return this.stateSvc.maximized();
  }

  /**
   * @property isFocused
   * @description Returns window focused state.
   */
  @HostBinding('class.focused') get isFocused() {
    return this.stateSvc.focused();
  }

  /**
   * @property isLocked
   * @description Returns window locked state.
   */
  @HostBinding('class.locked') get isLocked() {
    return this.stateSvc.locked();
  }

  /**
   * @property isFullScreen
   * @description Returns window FullScreen state.
   */
  @HostBinding('class.fullscreen') get isFullScreen() {
    return this.placementSvc.placementMode() == 'fullScreen';
  }

  /**
   * @property canResize
   * @description Returns if mouse cursor is over resizing point.
   */
  @HostBinding('class.over-resizing-point') get canResize() {
    return this.isOverResizingPoint;
  }

  /**
   * @property width
   * @description Returns window width in pixels.
   */
  @HostBinding('style.width') get width() {
    return this.placementSvc.width() + 'px';
  }

  /**
   * @property height
   * @description Returns window height in pixels.
   */
  @HostBinding('style.height') get height() {
    return this.placementSvc.height() + 'px';
  }

  /**
   * @property left
   * @description Returns window offsetX in pixels.
   */
  @HostBinding('style.left') get left() {
    return this.placementSvc.offsetX() + 'px';
  }

  /**
   * @property top
   * @description Returns window offsetY in pixels.
   */
  @HostBinding('style.top') get top() {
    return this.placementSvc.offsetY() + 'px';
  }

  /**
   * @property resizing
   * @description Returns window resizing state.
   */
  @HostBinding('class.resizing') get resizing() {
    return this.isResizing;
  }

  /**
   * @property moving
   * @description Returns window moving state.
   */
  @HostBinding('class.moving') get moving() {
    return this.isMoving;
  }

  /**
   * @property isBorderless
   * @description Returns window borderless configuration property.
   */
  @HostBinding('class.borderless') get isBorderless() {
    return this.configurationSvc.borderless();
  }

  /**
   * @property noShadow
   * @description Returns window noShadow configuration property.
   */
  @HostBinding('class.noshadow') get hasNoShadow() {
    return this.configurationSvc.noShadow();
  }

  /**
   * @property isTransparent
   * @description Returns window isTransparent configuration property.
   */
  @HostBinding('class.transparent') get isTransparent() {
    return this.configurationSvc.transparent();
  }

  /**
   * @property background
   * @description Returns window background configuration property.
   */
  @HostBinding('style.background') get background() {
    return this.configurationSvc.background();
  }

  /**
   * @property backdropFilter
   * @description Returns window backdropFilter configuration property.
   */
  @HostBinding('style.backdrop-filter') get backdropFilter() {
    return this.configurationSvc.backdropFilter();
  }

  /**
   * @property getContentHeight
   * @description Returns window content container height (window height - topbar height).
   */
  get getContentHeight(): string {
    if (this.topbar?.nativeElement) {
      return (this.placementSvc.height() - this.topbar.nativeElement.clientHeight) + 'px'
    }
    return this.height;
  }

  /**
   * @function activate
   * @description Window activation through user click interaction.
   * @returns void
   */
  @HostListener('click') activate() {
    if (this.stateSvc.focused() || this.stateSvc.locked()) return;
    this.nwm.activateWindow(this.windowControllerService.id());
  }

  /**
   * @function ngAfterViewInit
   * @description Angular AfterViewInit component hook. Initializes mousedown and mousemove events.
   * @returns void
   */
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

  /**
   * @function activateMoveEvent
   * @description Starts mousemove event listener for moving window.
   * @param startX - initial X coordinate of mouse movement
   * @param startY - initial Y coordinate of mouse movement
   * @returns Subscription
   */
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
          this.stopEv(ev);
        }
      });
  }

  /**
   * @function activateResizeEvent
   * @description Starts mousemove event for resizing window.
   * @returns Subscription
   */
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
          this.stopEv(ev);
        }
      });
  }

  /**
   * @function activateMouseUpEvent
   * @description Starts mouseup events for stopping window resizing & moving.
   * @returns void
   */
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

  /**
   * @function stopEv
   * @description Function to prevent event default, stop propagation and stop immediate propagation.
   * @param ev - event to be stopped
   * @returns void
   */
  stopEv(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
    ev.stopImmediatePropagation();
  }
}
