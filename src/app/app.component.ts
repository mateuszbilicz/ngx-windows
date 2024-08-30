import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NgwWindowsManagerService} from "../../projects/ngx-windows/src/lib/ngw-windows-manager.service";
import {
  NgwWindowsContainerComponent
} from "../../projects/ngx-windows/src/lib/ngw-windows-container/ngw-windows-container.component";
import {TestAppComponent} from "./test-app/test-app.component";
import {
  CloseConfirmDialogExampleComponent
} from "./close-confirm-dialog-example/close-confirm-dialog-example.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgwWindowsContainerComponent],
  providers: [
    NgwWindowsManagerService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(public nwm: NgwWindowsManagerService) {
    this.nwm.createWindow(TestAppComponent, {
      name: 'Test Window',
      placementMode: undefined,
      placement: {
        width: 800,
        height: 600,
        offsetX: 30,
        offsetY: 30
      },
      state: {}
    });
  }

  addWindowWithCloseDialog() {
    this.nwm.createWindow(CloseConfirmDialogExampleComponent, {
      name: 'Close confirm example',
      placementMode: undefined,
      placement: {
        width: 800,
        height: 600,
        offsetX: 30,
        offsetY: 30
      },
      state: {}
    });
  }
}
