import {Component, effect, input} from '@angular/core';
import {NgwWindowControllerService} from "ngx-windows/src/lib/ngw-window-controller.service";

@Component({
  selector: 'app-test-app',
  standalone: true,
  imports: [],
  templateUrl: './test-app.component.html',
  styleUrl: './test-app.component.scss'
})
export class TestAppComponent {
  windowController = input.required<NgwWindowControllerService>();

  constructor() {
    effect(() => {
      let config = this.windowController().instance!.properties().configuration!;
      config.transparent = true;
      config.background = 'rgba(235, 235, 235, .75)';
      config.backdropFilter = 'blur(2px)';
      config.showTopBar = false;
      config.resizeable = false;
      config.moveable = false;
      config.noShadow = true;
      config.allowOutboundMovements = true;

      setTimeout(() => {
        config.showTopBar = true;
        config.resizeable = true;
        config.moveable = true;
        config.noShadow = false;
        config.borderless = true;
      }, 1000);
    });
  }
}
