import {computed, Injectable, signal} from '@angular/core';
import {NgwWindowConfiguration} from "../../models/ngw-window-properties.model";

@Injectable({
  providedIn: 'root'
})
/**
 * @class NgwWindowConfigurationService
 * @description Service to control window configuration. Provided in and used by NgwWindowComponent.
 */
export class NgwWindowConfigurationService {
  /**
   * @property displayProperties
   * @description All window display properties.
   */
  displayProperties = signal<NgwWindowConfiguration>({});

  /**
   * @property displayName
   * @description Display window name in topbar.
   * @default true
   */
  displayName = computed(() => this.displayProperties().displayName ?? true);

  /**
   * @property showLeftControls
   * @description Show window left controls, by default - menu button.
   * @default true
   */
  showLeftControls = computed(() => this.displayProperties().showLeftControls ?? false);

  /**
   * @property showRightControls
   * @description Show window right controls, by default - minimize, maximize, close.
   * @default true
   */
  showRightControls = computed(() => this.displayProperties().showRightControls ?? true);

  /**
   * @property showMenuButton
   * @description Show window menu button which emits onMenu$ on click.
   * @default false
   */
  showMenuButton = computed(() => this.displayProperties().showMenuButton ?? false);

  /**
   * @property maximizable
   * @description Sets if window can be maximized.
   * @default true
   */
  maximizable = computed(() => this.displayProperties().maximizable ?? true);

  /**
   * @property minimizable
   * @description Sets if window can be minimized.
   * @default true
   */
  minimizable = computed(() => this.displayProperties().minimizable ?? true);

  /**
   * @property closeable
   * @description Sets if window can be closed by user.
   * @default true
   */
  closeable = computed(() => this.displayProperties().closeable ?? true);

  /**
   * @property preventClose
   * @description Sets close prevention by user. You can use onClose$ to show close confirmation dialog and then use removeWindow.
   * @default false
   */
  preventClose = computed(() => this.displayProperties().preventClose ?? false);

  /**
   * @property showTopBar
   * @description Sets if window topbar could be shown. Without it you need to manually manage window state, close and move.
   * @default true
   */
  showTopBar = computed(() => this.displayProperties().showTopBar ?? true);

  /**
   * @property placementDistanceTolerance
   * @description Tolerance of placement prediction & alignment (distance from placement point).
   * @default 64
   */
  placementDistanceTolerance = computed(() => this.displayProperties().placementDistanceTolerance ?? 64);

  /**
   * @property resizeDistanceTolerance
   * @description Distance to window resize point for resize activation (right bottom corner).
   * @default 12
   */
  resizeDistanceTolerance = computed(() => this.displayProperties().resizeDistanceTolerance ?? 12);

  /**
   * @property allowOutboundMovements
   * @description Sets if window could be moved outside user viewport.
   * @default false
   */
  allowOutboundMovements = computed(() => this.displayProperties().allowOutboundMovements ?? false);

  /**
   * @property allowPlacementAlignment
   * @description Sets if window could be aligned to placement point.
   * @default false
   */
  allowPlacementAlignment = computed(() => this.displayProperties().allowPlacementAlignment ?? false);

  /**
   * @property borderless
   * @description Disables window border.
   * @default false
   */
  borderless = computed(() => this.displayProperties().borderless ?? false);

  /**
   * @property noShadow
   * @description Disabled window shadow.
   * @default false
   */
  noShadow = computed(() => this.displayProperties().noShadow ?? false);

  /**
   * @property transparent
   * @description Sets if window should be transparent.
   * @default false
   */
  transparent = computed(() => this.displayProperties().transparent ?? false);

  /**
   * @property background
   * @description Sets css window background (if not transparent).
   * @default 'none'
   */
  background = computed(() => this.displayProperties().background ?? 'none');

  /**
   * @property backdropFilter
   * @description Sets css backdrop filter.
   * @default undefined
   */
  backdropFilter = computed(() => this.displayProperties().backdropFilter);

  /**
   * @property moveable
   * @description Sets if window could be moveable.
   * @default true
   */
  moveable = computed(() => this.displayProperties().moveable ?? true);

  /**
   * @property resizeable
   * @description Sets if window could be resizeable.
   * @default true
   */
  resizeable = computed(() => this.displayProperties().resizeable ?? true);

  /**
   * @function setProperty
   * @description Sets specific property defined in NgwWindowConfiguration.
   * @param property - property name to set
   * @param value - new value for property
   * @returns void
   */
  setProperty<T extends keyof NgwWindowConfiguration>(property: T, value: NgwWindowConfiguration[T]) {
    this.displayProperties.set({
      ...this.displayProperties(),
      [property]: value
    });
  }

  /**
   * @function setProperties
   * @description Overrides all window configuration properties.
   * @param properties - new window configuration properties
   * @returns void
   */
  setProperties(properties: NgwWindowConfiguration) {
    this.displayProperties.set(properties);
  }

  /**
   * @function appendProperties
   * @description Concat new properties with previous.
   * @param properties - window configuration properties
   * @returns void
   */
  appendProperties(properties: Partial<NgwWindowConfiguration>) {
    this.displayProperties.update(prev => ({
      ...prev,
      ...properties
    }));
  }
}
