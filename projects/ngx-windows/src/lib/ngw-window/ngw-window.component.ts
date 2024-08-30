import {
  AfterViewInit,
  Component, DestroyRef,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
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
import {NgwWindowControllerService} from "../ngw-window-controller.service";

@Component({
  selector: 'ngw-window',
  standalone: true,
  imports: [
    NgComponentOutlet,
    IconComponent,
    NgTemplateOutlet
  ],
  providers: [
    NgwWindowControllerService
  ],
  templateUrl: './ngw-window.component.html',
  styleUrl: './ngw-window.component.css',
  encapsulation: ViewEncapsulation.None
})
export class NgwWindowComponent
  implements AfterViewInit {
  @Input() properties!: NgwWindowProperties;
  private isResizing = false;
  private isMoving = false;
  private mouseMoveListener: Subscription | undefined;
  private isOverResizingPoint: boolean = false;
  topbar?: ElementRef;
  @ViewChild('_topbar') set __topbar(e: ElementRef) {
    if (e) this.topbar = e;
  };

  @HostBinding('class.minimized') get isMinimized() {
    return this.properties.state.minimized;
  }

  @HostBinding('class.maximized') get isMaximized() {
    return this.properties.state.maximized;
  }

  @HostBinding('class.focused') get isFocused() {
    return this.properties.state.focused;
  }

  @HostBinding('class.locked') get isLocked() {
    return this.properties.state.locked;
  }

  @HostBinding('class.fullscreen') get isFullScreen() {
    return this.properties.placementMode == 'fullScreen';
  }

  @HostBinding('class.over-resizing-point') get canResize() {
    return this.isOverResizingPoint;
  }

  @HostBinding('style.width') get width() {
    return this.properties.placement.width + 'px';
  }

  @HostBinding('style.height') get height() {
    return this.properties.placement.height + 'px';
  }

  @HostBinding('style.left') get left() {
    return this.properties.placement.offsetX + 'px';
  }

  @HostBinding('style.top') get top() {
    return this.properties.placement.offsetY + 'px';
  }

  @HostBinding('class.resizing') get resizing() {
    return this.isResizing;
  }

  @HostBinding('class.moving') get moving() {
    return this.isMoving;
  }

  @HostBinding('class.borderless') get isBorderless() {
    return this.properties.configuration?.borderless;
  }

  @HostBinding('class.noshadow') get hasNoShadow() {
    return this.properties.configuration?.noShadow;
  }

  @HostBinding('class.transparent') get isTransparent() {
    return this.properties.configuration?.transparent;
  }

  @HostBinding('style.background') get background() {
    return this.properties.configuration?.background;
  }

  @HostBinding('style.backdrop-filter') get backdropFilter() {
    return this.properties.configuration?.backdropFilter;
  }

  @HostListener('click') activate() {
    if (this.isFocused) return;
    this.nwm.activateWindow(this.properties.id);
  }

  constructor(public nwm: NgwWindowsManagerService,
              private el: ElementRef,
              private destroyRef: DestroyRef,
              public windowControllerService: NgwWindowControllerService) {
    this.windowControllerService.instance = this;
  }

  private get placementDistanceTolerance() {
    return this.properties.configuration?.placementDistanceTolerance ?? 64;
  }

  private get resizeDistanceTolerance() {
    return this.properties.configuration?.resizeDistanceTolerance ?? 12;
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
            || !this.properties.placementMode == undefined
          ) return;
          this.activate();
          this.isResizing = !!this.properties.configuration?.resizeable
            && distance2D(
              ev.clientX,
              ev.clientY,
              this.properties.placement.width + this.properties.placement.offsetX,
              this.properties.placement.height + this.properties.placement.offsetY
            ) < this.resizeDistanceTolerance;
          const startX = ev.clientX - this.properties.placement.offsetX,
            startY = ev.clientY - this.properties.placement.offsetY;
          if (this.isResizing) {
            this.mouseMoveListener = this.activateResizeEvent();
            this.activateMouseUpEvent(startX, startY);
            return;
          }
          if (!this.topbar?.nativeElement) return;
          this.isMoving = !!this.properties.configuration?.moveable
            && (ev.clientY < this.properties.placement.offsetY + this.topbar.nativeElement.clientHeight);
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
          this.isOverResizingPoint = !!this.properties.configuration?.resizeable
            && distance2D(
              ev.clientX,
              ev.clientY,
              this.properties.placement.width + this.properties.placement.offsetX,
              this.properties.placement.height + this.properties.placement.offsetY
            ) < this.resizeDistanceTolerance;
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
          moveNgwWindow(
            this.properties,
            ev.clientX - startX,
            ev.clientY - startY,
            window.innerWidth,
            window.innerHeight
          );
          if (this.properties.configuration?.allowPlacementAlignment) {
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
            this.properties,
            ev.clientX - this.properties.placement.offsetX,
            ev.clientY - this.properties.placement.offsetY,
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
            if (this.properties.configuration?.allowPlacementAlignment) {
              doNgwWindowPlacementIfPossible(
                this.properties,
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

  getContentHeight(topbar: ElementRef<any>): string {
    return (this.properties.placement.height - topbar.nativeElement.clientHeight) + 'px';
  }

  minimize() {
    this.properties.state.minimized = true;
  }

  toggleMaximize() {
    this.properties.state.maximized = !this.properties.state.maximized;
  }

  close(ev: MouseEvent) {
    if (this.properties.configuration?.preventClose) {
      this.windowControllerService.onClose$.next(ev);
      return;
    }
    this.nwm.removeWindow(this.properties.id);
  }

}
