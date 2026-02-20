import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {NgwWindowsManagerService} from "../ngw-windows-manager.service";
import {NgwWindowComponent} from "../ngw-window/ngw-window.component";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {debounceTime, distinctUntilChanged, throttleTime} from "rxjs";

@Component({
  selector: 'ngw-windows-container',
  standalone: true,
  imports: [
    NgwWindowComponent
  ],
  templateUrl: './ngw-windows-container.component.html',
  styles: '',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgwWindowsContainerComponent
  implements AfterViewInit {
  @ViewChild('windowPlacementPrediction', {static: true}) windowPlacementPrediction!: ElementRef;

  constructor(public nwm: NgwWindowsManagerService,
              private destroyRef: DestroyRef) {
  }

  ngAfterViewInit() {
    this.nwm.onPlacementChange$
      .pipe(
        throttleTime(60),
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged()
      )
      .subscribe(placement => {
        const elem = this.windowPlacementPrediction.nativeElement;
        if (!placement) {
          elem.classList.remove('show');
          return;
        }
        if (!elem.classList.contains('visible')) elem.classList.add('visible');
        if (!elem.classList.contains('show')) elem.classList.add('show');
        const screenW = window.innerWidth / 100,
          screenH = window.innerHeight / 100,
          margin = 4;
        elem.style.left = (placement.offsetX * screenW) + margin + 'px';
        elem.style.top = (placement.offsetY * screenH) + margin + 'px';
        elem.style.width = (placement.width * screenW) - (margin * 2) - 4 + 'px';
        elem.style.height = (placement.height * screenH) - (margin * 2) - 4 + 'px';
      });
    this.nwm.onPlacementChange$
      .pipe(
        debounceTime(150),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: placement => {
          if (!placement) this.windowPlacementPrediction.nativeElement.classList.remove('visible');
        }
      })
  }
}
