import {Component, input, OnInit, ViewEncapsulation} from '@angular/core';
import {NgwWindowsManagerService} from "../../../projects/ngx-windows/src/lib/ngw-windows-manager.service";
import {NgwWindowControllerService} from "ngx-windows/src/lib/ngw-window/services/ngw-window-controller.service";

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
    this.windowController().data().lockParent();
  }

  cancel() {
    this.windowController().data()!.unlockParent();
    this.nwm.removeWindow(this.windowController().id());
  }

  confirm() {
    this.windowController().data().confirmClose.set(true);
  }
}
