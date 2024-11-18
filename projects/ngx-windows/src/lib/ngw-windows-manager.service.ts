import '@angular/compiler';
import {Injectable, signal} from '@angular/core';
import {
  ActiveNgwWindowProps,
  NgwWindowPropsWithoutId,
  NgwWindowPropsWithService
} from "./models/ngw-window-properties.model";
import {BehaviorSubject, Subject} from "rxjs";
import {createNgwWindowPropertiesDefaults} from "./api/ngw-windows.api";
import {NgwWindowPlacement} from "./models/placement.model";
import {NgwWindowControllerService} from "./ngw-window/services/ngw-window-controller.service";

@Injectable({
  providedIn: 'root'
})
/**
 * @class NgwWindowsManagerService
 * @description Windows management service. Allows filtering, controlling and state management of all windows. Provided in and used by NgwWindowComponent.
 */
export class NgwWindowsManagerService {

  /**
   * @property activeWindows
   * @description Full windows list.
   */
  activeWindows = signal<ActiveNgwWindowProps[]>([]);

  /**
   * @property currentActiveWindow
   * @description Currently active window object. If all windows are not active then it's undefined. Better to not set this property manually. Use activateWindow function instead.
   * @default undefined
   */
  currentActiveWindow= signal<ActiveNgwWindowProps | undefined>(undefined);

  /**
   * @property onPlacementChange$
   * @description Window placement information while moving - for preview of window placement while user moves window.
   */
  onPlacementChange$: BehaviorSubject<NgwWindowPlacement | undefined> = new BehaviorSubject<NgwWindowPlacement | undefined>(undefined);

  /**
   * @function createWindow
   * @description Creates window instance with all properties. Window is not fully initialized yet.
   * @param properties - properties of the window
   * @param activate - whether to activate the window after creation
   * @returns ActiveNgwWindowProps
   */
  createWindow(properties: NgwWindowPropsWithoutId, activate?: boolean): ActiveNgwWindowProps {
    const props: ActiveNgwWindowProps = {
      ...createNgwWindowPropertiesDefaults(),
      ...properties,
      service: undefined,
      onRegister$: new Subject<NgwWindowControllerService>()
    };
    this.activeWindows.update(currentActive => [
      ...currentActive,
      props
    ]);
    if (activate) {
      this.activateWindow(props.id);
    }
    return props;
  }

  /**
   * @function removeWindow
   * @description Removes window.
   * @param windowId - ID of the window to remove
   * @returns void
   */
  removeWindow(windowId: string): void {
    const activeWindow = this.currentActiveWindow();
    if (activeWindow && activeWindow.id === windowId)
      this.currentActiveWindow.set(undefined);
    this.activeWindows.update(currentActive =>
      currentActive
        .filter(win => win.id !== windowId)
    );
  }

  /**
   * @function filterWindowsByName
   * @description Find windows that name contains specified nameFilter.
   * @param nameFilter - name filter to search by
   * @returns Array<NgwWindowPropsWithService>
   */
  filterWindowsByName(nameFilter?: string): NgwWindowPropsWithService[] {
    nameFilter = nameFilter?.toLowerCase() ?? '';
    return this.activeWindows()
      .filter(win =>
        win.name.toLowerCase().includes(nameFilter)
      );
  }

  /**
   * @function getWindowById
   * @description Get window by its ID. If there's no such window then return undefined.
   * @param windowId - ID of the window
   * @returns NgwWindowPropsWithService | undefined
   */
  getWindowById(windowId: string): NgwWindowPropsWithService | undefined {
    return this.activeWindows()
      .find(win => win.id === windowId);
  }

  /**
   * @function getOpenWindows
   * @description Get all not minimized windows.
   * @returns Array<NgwWindowPropsWithService>
   */
  getOpenWindows(): NgwWindowPropsWithService[] {
    return this.activeWindows()
      .filter(win => !win.service?.stateSvc.minimized());
  }

  /**
   * @function getMaximizedWindows
   * @description Get all maximized windows.
   * @returns Array<NgwWindowPropsWithService>
   */
  getMaximizedWindows(): NgwWindowPropsWithService[] {
    return this.activeWindows()
      .filter(win => win.service?.stateSvc.maximized());
  }

  /**
   * @function getMinimizedWindows
   * @description Get all minimized windows.
   * @returns Array<NgwWindowPropsWithService>
   */
  getMinimizedWindows(): NgwWindowPropsWithService[] {
    return this.activeWindows()
      .filter(win => win.service?.stateSvc.minimized());
  }

  /**
   * @function getActiveWindow
   * @description Get current active window or undefined if there's no focused window.
   * @returns NgwWindowPropsWithService | undefined
   */
  getActiveWindow(): NgwWindowPropsWithService | undefined {
    return this.currentActiveWindow();
  }

  /**
   * @function activateWindow
   * @description Activate (focus) window. If there's focused window then it will be deactivated. If window that you're activating is minimized, then it will open it.
   * @param windowId - ID of window to activate
   * @returns void
   */
  activateWindow(windowId: string): void {
    let currActive = this.currentActiveWindow();
    if (currActive) {
      if (currActive.id === windowId) return;
      currActive.service?.stateSvc.focused.set(false);
    }
    let nextActive = this.activeWindows()
      .find(win => win.id === windowId);
    if (!nextActive) return;
    nextActive.service?.stateSvc.focused.set(true);
    this.currentActiveWindow.set(nextActive);
    if (nextActive.service?.stateSvc.minimized()) {
      nextActive.service?.stateSvc.minimized.set(false);
    }
  }

  /**
   * @function deactivateCurrentActiveWindow
   * @description Deactivate (unfocus) window.
   * @returns void
   */
  deactivateCurrentActiveWindow(): void {
    let currActive = this.currentActiveWindow();
    if (currActive) {
      currActive.service?.stateSvc.focused.set(false);
    }
    this.currentActiveWindow.set(undefined);
  }

  /**
   * @function removeAllWindows
   * @description Instantly removes all active window. If some windows has close confirmation, then it will be skipped.
   * @returns void
   */
  removeAllWindows(): void {
    this.activeWindows.set([]);
    this.currentActiveWindow.set(undefined);
  }

  /**
   * @function onPlacementPrediction
   * @description Window calls this function when user moves it and placement prediction is enabled.
   * @param placement - window placement information while moving
   * @returns void
   */
  onPlacementPrediction(placement?: NgwWindowPlacement): void {
    this.onPlacementChange$.next(placement);
  }

  /**
   * @function registerWindow
   * @description Window calls this function after it's initialized. This function also calls ActiveNgwWindowProps.onRegister$ and completes it.
   * @param id - window ID
   * @param service - window controller service instance from NgwWindowComponent
   * @returns void
   */
  registerWindow(id: string, service: NgwWindowControllerService): void {
    let onRegisterSubject: Subject<NgwWindowControllerService> | undefined = undefined;
    this.activeWindows.update(currentActive =>
      currentActive
        .map(win => {
          if (win.id === id) {
            onRegisterSubject = win.onRegister$;
            win.service = service;
          }
          return win;
        })
    );
    if (onRegisterSubject !== undefined) {
      onRegisterSubject = onRegisterSubject as Subject<NgwWindowControllerService>;
      onRegisterSubject.next(service);
      onRegisterSubject.complete();
    }
  }
}
