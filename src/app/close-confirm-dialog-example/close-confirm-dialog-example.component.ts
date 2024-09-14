import '@angular/compiler';
import {Component, DestroyRef, effect, input, signal, ViewEncapsulation} from '@angular/core';
import {NgwWindowControllerService} from "../../../projects/ngx-windows/src/lib/ngw-window-controller.service";
import {NgwWindowsManagerService} from "../../../projects/ngx-windows/src/lib/ngw-windows-manager.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CloseConfirmDialogComponent} from "../close-confirm-dialog/close-confirm-dialog.component";
import {debounceTime} from "rxjs";

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
  closeConfirmWindowId = signal<string | undefined>(undefined);
  confirmClose = signal(false);
  closeLocked = signal(false);

  constructor(private nwm: NgwWindowsManagerService,
              private destroyRef: DestroyRef) {
    effect(() => {
      const winC = this.windowController();
      winC.instance!.properties().configuration!.preventClose = true;
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
            const existing = this.nwm.getWindowById(this.closeConfirmWindowId()!);
            if (existing) {
              this.nwm.activateWindow(this.closeConfirmWindowId()!);
              return;
            }
            this.createCloseConfirmWindow(ev);
          }
        })
    });
    effect(() => {
      if (this.confirmClose()) {
        if (this.closeConfirmWindowId()) this.nwm.removeWindow(this.closeConfirmWindowId()!);
        this.nwm.removeWindow(this.windowController().instance!.properties().id);
      }
    });
  }

  createCloseConfirmWindow(ev: MouseEvent) {
    const createdWin = this.nwm.createWindow(
      this.closeConfirmDialogComponent,
      {
        configuration: {
          showTopBar: true,
          preventClose: true,
          showLeftControls: false,
          minimizable: false,
          maximizable: false,
          moveable: true,
          resizeable: false
        },
        placement: {
          width: 300,
          height: 100,
          offsetX: ev.clientX - 300,
          offsetY: ev.clientY
        },
        placementMode: undefined,
        state: {},
        name: 'Close window?',
        inputs: {
          confirmClose: this.confirmClose,
          lockParent: () => {
            this.windowController().instance!.setLocked(true);
          },
          unlockParent: () => {
            this.windowController().instance!.setLocked(false);
          }
        }
      }
    );
    this.closeConfirmWindowId.set(createdWin.id);
    this.nwm.activateWindow(createdWin.id);
  }
}
