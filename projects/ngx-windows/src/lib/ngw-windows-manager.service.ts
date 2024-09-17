import '@angular/compiler';
import {Injectable} from '@angular/core';
import {
  ActiveNgwWindowProps,
  NgwWindowPropsWithoutId, NgwWindowPropsWithService
} from "./models/ngw-window-properties.model";
import {BehaviorSubject, Subject} from "rxjs";
import {createNgwWindowPropertiesDefaults} from "./api/ngw-windows.api";
import {NgwWindowPlacement} from "./models/placement.model";
import {NgwWindowControllerService} from "./ngw-window/services/ngw-window-controller.service";

@Injectable({
  providedIn: 'root'
})
export class NgwWindowsManagerService {

  activeWindows$: BehaviorSubject<ActiveNgwWindowProps[]> = new BehaviorSubject<ActiveNgwWindowProps[]>([]);
  currentActiveWindow$: BehaviorSubject<ActiveNgwWindowProps | undefined> = new BehaviorSubject<ActiveNgwWindowProps | undefined>(undefined);
  onPlacementChange$: BehaviorSubject<NgwWindowPlacement | undefined> = new BehaviorSubject<NgwWindowPlacement | undefined>(undefined);

  createWindow(properties: NgwWindowPropsWithoutId, activate?: boolean): ActiveNgwWindowProps {
    const props: ActiveNgwWindowProps = {
      ...createNgwWindowPropertiesDefaults(),
      ...properties,
      service: undefined,
      onRegister$: new Subject<NgwWindowControllerService>()
    };
    this.activeWindows$.next([
      ...this.activeWindows$.getValue(),
      props
    ]);
    if (activate) {
      this.activateWindow(props.id);
    }
    return props;
  }

  removeWindow(windowId: string): void {
    const activeWindow = this.currentActiveWindow$.getValue();
    if (activeWindow && activeWindow.id === windowId)
      this.currentActiveWindow$.next(undefined);
    this.activeWindows$.next(
      this.activeWindows$.getValue()
        .filter(window => window.id !== windowId)
    );
  }

  filterWindowsByName(nameFilter?: string): NgwWindowPropsWithService[] {
    nameFilter = nameFilter?.toLowerCase() ?? '';
    return this.activeWindows$.getValue()
      .filter(win =>
        win.name.toLowerCase().includes(nameFilter)
      );
  }

  getWindowById(windowId: string): NgwWindowPropsWithService | undefined {
    return this.activeWindows$.getValue()
      .find(win => win.id === windowId);
  }

  getOpenWindows(): NgwWindowPropsWithService[] {
    return this.activeWindows$.getValue()
      .filter(win => !win.service?.stateSvc.minimized());
  }

  getMaximizedWindows(): NgwWindowPropsWithService[] {
    return this.activeWindows$.getValue()
      .filter(win => win.service?.stateSvc.maximized());
  }

  getMinimizedWindows(): NgwWindowPropsWithService[] {
    return this.activeWindows$.getValue()
      .filter(win => win.service?.stateSvc.minimized());
  }

  getActiveWindow(): NgwWindowPropsWithService | undefined {
    return this.currentActiveWindow$.getValue();
  }

  activateWindow(windowId: string): void {
    let currActive = this.currentActiveWindow$.getValue();
    if (currActive) {
      if (currActive.id === windowId) return;
      currActive.service?.stateSvc.focused.set(false);
    }
    let nextActive = this.activeWindows$.getValue()
      .find(win => win.id === windowId);
    if (!nextActive) return;
    nextActive.service?.stateSvc.focused.set(true);
    this.currentActiveWindow$.next(nextActive);
  }

  removeAllWindows(): void {
    this.activeWindows$.next([]);
    this.currentActiveWindow$.next(undefined);
  }

  onPlacementPrediction(placement?: NgwWindowPlacement) {
    this.onPlacementChange$.next(placement);
  }

  registerWindow(id: string, service: NgwWindowControllerService): void {
    let onRegisterSubject: Subject<NgwWindowControllerService> | undefined = undefined;
    this.activeWindows$.next([
      ...this.activeWindows$.getValue().map(win => {
        if (win.id === id) {
          onRegisterSubject = win.onRegister$;
          win.service = service;
        }
        return win;
      })
    ]);
    if (onRegisterSubject !== undefined) {
      onRegisterSubject = onRegisterSubject as Subject<NgwWindowControllerService>;
      onRegisterSubject.next(service);
      onRegisterSubject.complete();
    }
  }
}
