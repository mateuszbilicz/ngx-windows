import {Component, computed, ViewEncapsulation} from '@angular/core';
import {ActiveNgwWindowProps, IconComponent, NgwWindowsManagerService} from "ngx-windows";

@Component({
  selector: 'app-active-windows-bar',
  standalone: true,
  imports: [
    IconComponent
  ],
  templateUrl: './active-windows-bar.component.html',
  styleUrl: './active-windows-bar.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ActiveWindowsBarComponent {
  windowsFiltered = computed(() =>
    this.ngwWindowsManagerService.activeWindows()
      .filter(win => !win.service?.data()?.skipInTaskbar)
  );
  activeWindow = computed(() => this.ngwWindowsManagerService.currentActiveWindow());

  constructor(private ngwWindowsManagerService: NgwWindowsManagerService) {}

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

  trackByWindowId = (index: number, win: ActiveNgwWindowProps) => win.id;
}
