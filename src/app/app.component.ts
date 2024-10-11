import {Component, DestroyRef} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TestAppComponent} from "./test-app/test-app.component";
import {
  CloseConfirmDialogExampleComponent
} from "./close-confirm-dialog-example/close-confirm-dialog-example.component";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ActiveWindowsBarComponent} from "./active-windows-bar/active-windows-bar.component";
import {NgwWindowsContainerComponent, NgwWindowsManagerService} from "ngx-windows";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgwWindowsContainerComponent, ActiveWindowsBarComponent],
  providers: [
    NgwWindowsManagerService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(public nwm: NgwWindowsManagerService,
              private destroyRef: DestroyRef) {
    const win = this.nwm.createWindow({
      name: 'Test Window',
      component: TestAppComponent
    });
    win.onRegister$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(service => {
        service.placementSvc.setAll(
          800,
          600,
          30,
          30
        );
      });
  }

  addWindowWithCloseDialog() {
    const win = this.nwm.createWindow({
      name: 'Close confirm example',
      component: CloseConfirmDialogExampleComponent
    });
    win.onRegister$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(service => {
        service.placementSvc.setAll(
          800,
          600,
          30,
          30
        );
      });
  }
}
