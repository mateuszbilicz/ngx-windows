import {ChangeDetectionStrategy, Component, inject, Injector, input, ViewEncapsulation} from '@angular/core';
import {NgwWindowControllerService, NgwWindowsManagerService} from "ngx-windows";
import {takeUntilDestroyed, toObservable} from "@angular/core/rxjs-interop";
import {filter, switchMap} from "rxjs";

@Component({
  selector: 'app-close-confirm-dialog',
  imports: [],
  templateUrl: './close-confirm-dialog.component.html',
  styleUrl: './close-confirm-dialog.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CloseConfirmDialogComponent {
  protected readonly nwm = inject(NgwWindowsManagerService);
  protected readonly injector = inject(Injector);
  windowController = input.required<NgwWindowControllerService>();

  constructor() {
    toObservable(this.windowController)
      .pipe(
        takeUntilDestroyed(),
        filter(winC => !!winC),
        switchMap((winC) => toObservable(winC.data, {injector: this.injector})),
        filter(data => !!data)
      )
      .subscribe((data) => data.lockParent())
  }

  cancel() {
    this.windowController().data()!.unlockParent();
    this.nwm.removeWindow(this.windowController().id());
  }

  confirm() {
    this.windowController().data().confirmClose.set(true);
  }
}
