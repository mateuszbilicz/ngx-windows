import '@angular/compiler';
import {Component, DestroyRef, effect, input, signal, ViewEncapsulation} from '@angular/core';
import {NgwWindowsManagerService} from "../../../projects/ngx-windows/src/lib/ngw-windows-manager.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CloseConfirmDialogComponent} from "../close-confirm-dialog/close-confirm-dialog.component";
import {debounceTime} from "rxjs";
import {NgwWindowControllerService} from "ngx-windows/src/lib/ngw-window/services/ngw-window-controller.service";

@Component({
  selector: 'app-close-confirm-dialog-example',
  standalone: true,
  imports: [],
  templateUrl: './close-confirm-dialog-example.component.html',
  styleUrl: './close-confirm-dialog-example.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CloseConfirmDialogExampleComponent {

  windowController = input.required<NgwWindowControllerService>();
  closeConfirmDialogComponent = CloseConfirmDialogComponent;
  closeConfirmWindowId: string | undefined = undefined;
  confirmClose = signal(false);
  closeLocked = signal(false);

  constructor(private nwm: NgwWindowsManagerService,
              private destroyRef: DestroyRef) {
    let onThisWindowInit = effect(() => {
      const winC = this.windowController();
      winC.configurationSvc.setProperty('preventClose', true);
      winC.onClose$
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          debounceTime(30)
        )
        .subscribe({
          next: (ev: MouseEvent) => {
            if (!this.closeLocked()) {
              this.confirmClose.set(true);
            }
            const existing = this.nwm.getWindowById(this.closeConfirmWindowId!);
            if (existing) {
              this.nwm.activateWindow(this.closeConfirmWindowId!);
              return;
            }
            this.createCloseConfirmWindow(ev);
          }
        });
      onThisWindowInit.destroy();
    }, {allowSignalWrites: true});
    effect(() => {
      if (this.confirmClose()) {
        if (this.closeConfirmWindowId) this.nwm.removeWindow(this.closeConfirmWindowId!);
        this.nwm.removeWindow(this.windowController().id());
      }
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
            ev.clientX - 300,
            ev.clientY
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
