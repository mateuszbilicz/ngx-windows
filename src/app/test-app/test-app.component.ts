import {Component, effect, input} from '@angular/core';
import {NgwWindowControllerService} from "ngx-windows";

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
      let configSvc = this.windowController().configurationSvc;
      configSvc.displayProperties.set({
        transparent: true,
        background: 'rgba(235, 235, 235, .75)',
        backdropFilter: 'blur(2px)',
        showTopBar: false,
        resizeable: false,
        moveable: false,
        noShadow: true,
        allowOutboundMovements: true
      });

      setTimeout(() => {
        configSvc.appendProperties({
          showTopBar: true,
          resizeable: true,
          moveable: true,
          noShadow: false,
          borderless: true,
          allowPlacementAlignment: true
        });
      }, 1000);
    }, {allowSignalWrites: true});
  }
}
