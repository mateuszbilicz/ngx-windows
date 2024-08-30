import '@angular/compiler';
import {Injectable} from '@angular/core';
import {NgwWindowProperties, NgwWindowPropertiesWithoutId} from "./models/ngw-window-properties.model";
import {BehaviorSubject} from "rxjs";
import {createNgwWindowPropertiesDefaults} from "./api/ngw-windows.api";
import {NgwWindowPlacement} from "./models/placement.model";

@Injectable({
  providedIn: 'root'
})
export class NgwWindowsManagerService {

  activeWindows$: BehaviorSubject<NgwWindowProperties[]> = new BehaviorSubject<NgwWindowProperties[]>([]);
  currentActiveWindow$: BehaviorSubject<NgwWindowProperties | undefined> = new BehaviorSubject<NgwWindowProperties | undefined>(undefined);
  onPlacementChange$: BehaviorSubject<NgwWindowPlacement | undefined> = new BehaviorSubject<NgwWindowPlacement | undefined>(undefined);

  createWindow(component: any, properties?: NgwWindowPropertiesWithoutId, activate?: boolean): NgwWindowProperties {
    const props = {
      ...createNgwWindowPropertiesDefaults(),
      ...properties,
      component
    }
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

  filterWindowsByName(nameFilter?: string): NgwWindowProperties[] {
    nameFilter = nameFilter?.toLowerCase() ?? '';
    return this.activeWindows$.getValue()
      .filter(window =>
        window.name.toLowerCase().includes(nameFilter)
      );
  }

  getWindowById(windowId: string): NgwWindowProperties | undefined {
    return this.activeWindows$.getValue()
      .find(window => window.id === windowId);
  }

  getOpenWindows(): NgwWindowProperties[] {
    return this.activeWindows$.getValue()
      .filter(window => !window.state.minimized);
  }

  getMaximizedWindows(): NgwWindowProperties[] {
    return this.activeWindows$.getValue()
      .filter(window => window.state.maximized);
  }

  getMinimizedWindows(): NgwWindowProperties[] {
    return this.activeWindows$.getValue()
      .filter(window => window.state.minimized);
  }

  getActiveWindow(): NgwWindowProperties | undefined {
    return this.currentActiveWindow$.getValue();
  }

  activateWindow(windowId: string): void {
    let currActive = this.currentActiveWindow$.getValue();
    if (currActive) {
      if (currActive.id === windowId) return;
      currActive.state.focused = false;
    }
    let nextActive = this.activeWindows$.getValue()
      .find(window => window.id === windowId);
    if (!nextActive) return;
    nextActive.state.focused = true;
    this.currentActiveWindow$.next(nextActive);
  }

  removeAllWindows(): void {
    this.activeWindows$.next([]);
    this.currentActiveWindow$.next(undefined);
  }

  onPlacementPrediction(placement?: NgwWindowPlacement) {
    this.onPlacementChange$.next(placement);
  }
}
