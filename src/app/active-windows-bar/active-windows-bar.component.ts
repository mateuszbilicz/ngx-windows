import {ChangeDetectionStrategy, Component, computed, inject, ViewEncapsulation} from '@angular/core';
import {ActiveNgwWindowProps, IconComponent, NgwWindowsManagerService} from "ngx-windows";

@Component({
  selector: 'app-active-windows-bar',
  imports: [
    IconComponent
  ],
  templateUrl: './active-windows-bar.component.html',
  styleUrl: './active-windows-bar.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActiveWindowsBarComponent {
  protected readonly ngwWindowsManagerService = inject(NgwWindowsManagerService);
  windowsFiltered = computed(() =>
    this.ngwWindowsManagerService.activeWindows()
      .filter(win => !win.service?.data()?.skipInTaskbar)
  );
  activeWindow = computed(() => this.ngwWindowsManagerService.currentActiveWindow());

  activateWindow(windowId: string) {
    if (this.ngwWindowsManagerService.currentActiveWindow()?.id === windowId) {
      this.ngwWindowsManagerService.currentActiveWindow()!.service?.minimize();
    } else {
      this.ngwWindowsManagerService.activateWindow(windowId);
    }
  }

  closeWindow(win: ActiveNgwWindowProps, ev: MouseEvent) {
    win.service?.close(ev);
  }
}
