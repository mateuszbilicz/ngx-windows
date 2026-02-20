import {ChangeDetectionStrategy, Component, input, OnInit, ViewEncapsulation} from '@angular/core';
import {NgwWindowControllerService, NgwWindowsManagerService} from "ngx-windows";

@Component({
  selector: 'app-close-confirm-dialog',
  imports: [],
  templateUrl: './close-confirm-dialog.component.html',
  styleUrl: './close-confirm-dialog.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CloseConfirmDialogComponent
  implements OnInit {
  windowController = input.required<NgwWindowControllerService>();

  constructor(private nwm: NgwWindowsManagerService) {
  }

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
