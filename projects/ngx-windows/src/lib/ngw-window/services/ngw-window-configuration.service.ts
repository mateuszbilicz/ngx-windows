import {computed, Injectable, signal} from '@angular/core';
import {NgwWindowConfiguration} from "../../models/ngw-window-properties.model";

@Injectable({
  providedIn: 'root'
})
export class NgwWindowConfigurationService {
  displayProperties = signal<NgwWindowConfiguration>({});
  displayName = computed(() => this.displayProperties().displayName ?? true);
  showLeftControls = computed(() => this.displayProperties().showLeftControls ?? false);
  showRightControls = computed(() => this.displayProperties().showRightControls ?? true);
  showMenuButton = computed(() => this.displayProperties().showMenuButton ?? false);
  maximizable = computed(() => this.displayProperties().maximizable ?? true);
  minimizable = computed(() => this.displayProperties().minimizable ?? true);
  closeable = computed(() => this.displayProperties().closeable ?? true);
  preventClose = computed(() => this.displayProperties().preventClose ?? false);
  showTopBar = computed(() => this.displayProperties().showTopBar ?? true);
  placementDistanceTolerance = computed(() => this.displayProperties().placementDistanceTolerance ?? 64);
  resizeDistanceTolerance = computed(() => this.displayProperties().resizeDistanceTolerance ?? 12);
  allowOutboundMovements = computed(() => this.displayProperties().allowOutboundMovements ?? false);
  allowPlacementAlignment = computed(() => this.displayProperties().allowPlacementAlignment ?? false);
  borderless = computed(() => this.displayProperties().borderless ?? false);
  noShadow = computed(() => this.displayProperties().noShadow ?? false);
  transparent = computed(() => this.displayProperties().transparent ?? false);
  background = computed(() => this.displayProperties().background ?? '#eee');
  backdropFilter = computed(() => this.displayProperties().backdropFilter);
  moveable = computed(() => this.displayProperties().moveable ?? true);
  resizeable = computed(() => this.displayProperties().resizeable ?? true);

  constructor() {
    // this.setProperty('showLeftControls', true);
  }

  setProperty<T extends keyof NgwWindowConfiguration>(property: T, value: NgwWindowConfiguration[T]) {
    this.displayProperties.set({
      ...this.displayProperties(),
      [property]: value
    });
  }

  setProperties(properties: NgwWindowConfiguration) {
    this.displayProperties.set(properties);
  }

  appendProperties(properties: Partial<NgwWindowConfiguration>) {
    this.displayProperties.update(prev => ({
      ...prev,
      ...properties
    }));
  }
}
