import {NgwWindowPlacement, WindowPlacementsKeyName} from "./placement.model";

export interface NgwWindowPlacementLimits {
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export interface NgwWindowConfiguration {
  displayName?: boolean;
  showLeftControls?: boolean;
  showRightControls?: boolean;
  showMenuButton?: boolean;
  maximizable?: boolean;
  minimizable?: boolean;
  closeable?: boolean;
  preventClose?: boolean;
  showTopBar?: boolean;
  placementDistanceTolerance?: number;
  resizeDistanceTolerance?: number;
  allowOutboundMovements?: boolean;
  allowPlacementAlignment?: boolean;
  borderless?: boolean;
  noShadow?: boolean;
  transparent?: boolean;
  background?: string;
  backdropFilter?: string;
  moveable?: boolean;
  resizeable?: boolean;
}

export interface NgwWindowState {
  maximized?: boolean;
  minimized?: boolean;
  focused?: boolean;
  locked?: boolean;
}

export interface NgwWindowPropertiesWithoutId {
  name: string;
  placementMode: WindowPlacementsKeyName | undefined;
  placement: NgwWindowPlacement;
  placementLimits?: NgwWindowPlacementLimits;
  configuration?: NgwWindowConfiguration;
  state: NgwWindowState;
  component?: any;
  inputs?: any;
}

export interface NgwWindowProperties {
  id: string;
  name: string;
  placementMode: WindowPlacementsKeyName | undefined;
  placement: NgwWindowPlacement;
  placementLimits?: NgwWindowPlacementLimits;
  placementBeforeAuto?: NgwWindowPlacement;
  configuration?: NgwWindowConfiguration;
  state: NgwWindowState;
  component?: any;
  inputs?: any;
}
