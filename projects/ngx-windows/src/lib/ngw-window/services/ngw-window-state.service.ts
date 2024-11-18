import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * @class NgwWindowStateService
 * @description Service to control window state. Provided in and used by NgwWindowComponent.
 */
export class NgwWindowStateService {
  /**
   * @property minimized
   * @description Window minimized state signal.
   * @default false
   */
  minimized = signal<boolean>(false);

  /**
   * @property maximized
   * @description Window maximized state signal.
   * @default false
   */
  maximized = signal<boolean>(false);

  /**
   * @property focused
   * @description Window focused state signal.
   * @default false
   */
  focused = signal<boolean>(false);

  /**
   * @property locked
   * @description Window locked state signal.
   * @default false
   */
  locked = signal<boolean>(false);
}
