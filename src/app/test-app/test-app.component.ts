import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {NgwWindowControllerService} from "ngx-windows";
import {takeUntilDestroyed, toObservable} from "@angular/core/rxjs-interop";
import {filter, map, switchMap, tap, timer} from "rxjs";

@Component({
  selector: 'app-test-app',
  imports: [],
  templateUrl: './test-app.component.html',
  styleUrl: './test-app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestAppComponent {
  windowController = input.required<NgwWindowControllerService>();

  constructor() {
    toObservable(this.windowController)
      .pipe(
        takeUntilDestroyed(),
        filter((winC) => !!winC),
        map((winC) => winC.configurationSvc),
        tap((configSvc) => {
          configSvc.displayProperties.set({
            // transparent: true,
            // background: 'rgba(235, 235, 235, .75)',
            backdropFilter: 'blur(2px)',
            showTopBar: false,
            resizeable: false,
            moveable: false,
            noShadow: true,
            allowOutboundMovements: true
          });
        }),
        switchMap((configSvc) =>
          timer(1000)
            .pipe(
              map(() => configSvc)
            )
        )
      )
      .subscribe((configSvc) => {
        configSvc.appendProperties({
          showTopBar: true,
          resizeable: true,
          moveable: true,
          noShadow: false,
          borderless: true,
          allowPlacementAlignment: true
        });
      });
  }
}
