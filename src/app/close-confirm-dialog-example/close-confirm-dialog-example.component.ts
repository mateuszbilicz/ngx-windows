import '@angular/compiler';
import {ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal, ViewEncapsulation} from '@angular/core';
import {takeUntilDestroyed, toObservable} from "@angular/core/rxjs-interop";
import {CloseConfirmDialogComponent} from "../close-confirm-dialog/close-confirm-dialog.component";
import {debounceTime, filter, switchMap, take, tap} from "rxjs";
import {NgwWindowControllerService, NgwWindowsManagerService} from "ngx-windows";

@Component({
  selector: 'app-close-confirm-dialog-example',
  imports: [],
  templateUrl: './close-confirm-dialog-example.component.html',
  styleUrl: './close-confirm-dialog-example.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CloseConfirmDialogExampleComponent {
  protected readonly nwm = inject(NgwWindowsManagerService);
  protected readonly destroyRef = inject(DestroyRef);
  windowController = input.required<NgwWindowControllerService>();
  closeConfirmDialogComponent = CloseConfirmDialogComponent;
  closeConfirmWindowId: string | undefined = undefined;
  confirmClose = signal(false);
  closeLocked = signal(false);

  constructor() {
    toObservable(this.windowController)
      .pipe(
        takeUntilDestroyed(),
        filter(winC => !!winC),
        take(1),
        tap((winC) => {
          winC.configurationSvc.setProperty('preventClose', true)
        }),
        switchMap((winC) =>
          winC.onClose$
        ),
        debounceTime(30)
      )
      .subscribe((ev: MouseEvent) => {
        if (!this.closeLocked()) {
          this.confirmClose.set(true);
        }
        const existing = this.nwm.getWindowById(this.closeConfirmWindowId!);
        if (existing) {
          this.nwm.activateWindow(this.closeConfirmWindowId!);
          return;
        }
        this.createCloseConfirmWindow(ev);
      });
    toObservable(this.confirmClose)
      .pipe(
        takeUntilDestroyed(),
        filter(confirm => confirm),
      )
      .subscribe(() => {
        if (this.closeConfirmWindowId) this.nwm.removeWindow(this.closeConfirmWindowId);
        this.nwm.removeWindow(this.windowController().id());
      });
  }

  createCloseConfirmWindow(ev: MouseEvent) {
    const createdWin = this.nwm.createWindow(
      {
        component: this.closeConfirmDialogComponent,
        name: 'Close window?'
      }
    );
    createdWin.onRegister$
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: service => {
          service.placementSvc.setAll(
            300,
            120,
            Math.max(0, ev.clientX - 300),
            Math.min(ev.clientY, window.innerHeight - 150)
          );
          service.configurationSvc.appendProperties({
            showTopBar: true,
            preventClose: true,
            showLeftControls: false,
            minimizable: false,
            maximizable: false,
            moveable: false,
            closeable: false,
            resizeable: false
          });
          service.data.set({
            skipInTaskbar: true,
            confirmClose: this.confirmClose,
            lockParent: () => {
              this.windowController().setLocked(true);
            },
            unlockParent: () => {
              this.windowController().setLocked(false);
            }
          });
          this.nwm.activateWindow(createdWin.id);
        }
      });
    this.closeConfirmWindowId = createdWin.id;
  }
}
