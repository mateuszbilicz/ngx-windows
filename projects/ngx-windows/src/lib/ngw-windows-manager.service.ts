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
export class NgwWindowsManagerService {

  activeWindows = signal<ActiveNgwWindowProps[]>([]);
  currentActiveWindow= signal<ActiveNgwWindowProps | undefined>(undefined);
  onPlacementChange$: BehaviorSubject<NgwWindowPlacement | undefined> = new BehaviorSubject<NgwWindowPlacement | undefined>(undefined);

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

  removeWindow(windowId: string): void {
    const activeWindow = this.currentActiveWindow();
    if (activeWindow && activeWindow.id === windowId)
      this.currentActiveWindow.set(undefined);
    this.activeWindows.update(currentActive =>
      currentActive
        .filter(win => win.id !== windowId)
    );
  }

  filterWindowsByName(nameFilter?: string): NgwWindowPropsWithService[] {
    nameFilter = nameFilter?.toLowerCase() ?? '';
    return this.activeWindows()
      .filter(win =>
        win.name.toLowerCase().includes(nameFilter)
      );
  }

  getWindowById(windowId: string): NgwWindowPropsWithService | undefined {
    return this.activeWindows()
      .find(win => win.id === windowId);
  }

  getOpenWindows(): NgwWindowPropsWithService[] {
    return this.activeWindows()
      .filter(win => !win.service?.stateSvc.minimized());
  }

  getMaximizedWindows(): NgwWindowPropsWithService[] {
    return this.activeWindows()
      .filter(win => win.service?.stateSvc.maximized());
  }

  getMinimizedWindows(): NgwWindowPropsWithService[] {
    return this.activeWindows()
      .filter(win => win.service?.stateSvc.minimized());
  }

  getActiveWindow(): NgwWindowPropsWithService | undefined {
    return this.currentActiveWindow();
  }

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

  deactivateCurrentActiveWindow() {
    let currActive = this.currentActiveWindow();
    if (currActive) {
      currActive.service?.stateSvc.focused.set(false);
    }
    this.currentActiveWindow.set(undefined);
  }

  removeAllWindows(): void {
    this.activeWindows.set([]);
    this.currentActiveWindow.set(undefined);
  }

  onPlacementPrediction(placement?: NgwWindowPlacement) {
    this.onPlacementChange$.next(placement);
  }

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
