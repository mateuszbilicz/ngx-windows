import {Component, input, OnInit, ViewEncapsulation} from '@angular/core';
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
export class CloseConfirmDialogComponent
  implements OnInit {
  windowController = input.required<NgwWindowControllerService>();

  constructor(private nwm: NgwWindowsManagerService) {}

  ngOnInit() {
    this.windowController().instance!.properties().inputs!.lockParent();
  }

  cancel() {
    this.windowController().instance!.properties().inputs!.unlockParent();
    this.nwm.removeWindow(this.windowController().instance!.properties().id);
  }

  confirm() {
    this.windowController().instance!.properties().inputs!.confirmClose.set(true);
  }
}
