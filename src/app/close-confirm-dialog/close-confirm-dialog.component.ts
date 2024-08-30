import {Component, input, ViewEncapsulation} from '@angular/core';
import {NgwWindowControllerService} from "../../../projects/ngx-windows/src/lib/ngw-window-controller.service";
import {NgwWindowsManagerService} from "../../../projects/ngx-windows/src/lib/ngw-windows-manager.service";

@Component({
  selector: 'app-close-confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './close-confirm-dialog.component.html',
  styleUrl: './close-confirm-dialog.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CloseConfirmDialogComponent {
  windowController = input.required<NgwWindowControllerService>();

  constructor(private nwm: NgwWindowsManagerService) {}

  cancel() {
    this.nwm.removeWindow(this.windowController().instance!.properties.id);
  }

  confirm() {
    this.windowController().instance!.properties.inputs!.confirmClose.set(true);
  }
}
