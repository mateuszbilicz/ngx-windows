import {NgwWindowProperties} from "../models/ngw-window-properties.model";
import {getWindowPlacement} from "./ngw-window-placement.api";
import {NgwWindowPlacement, WindowPlacements} from "../models/placement.model";

export const createNgwWindowPropertiesDefaults = (): NgwWindowProperties => {
  const randomOffset = 8 + Math.floor(Math.random() * 24);
  return {
    id: `${Date.now().toString(36)}-${Math.floor(Math.random() * 9999).toString(36)}`,
    name: 'New window',
    placementMode: undefined,
    placement: {
      offsetX: randomOffset,
      offsetY: randomOffset,
      width: 50,
      height: 50
    },
    configuration: {
      displayName: true,
      showLeftControls: false,
      showRightControls: true,
      maximizable: true,
      minimizable: true,
      closeable: true,
      showTopBar: true,
      placementDistanceTolerance: 64,
      resizeDistanceTolerance: 12,
      allowOutboundMovements: true,
      allowPlacementAlignment: true,
      moveable: true,
      resizeable: true
    },
    state: {}
  }
}

export const resizeNgwWindow = (
  windowProperties: NgwWindowProperties,
  width: number,
  height: number,
  screenWidth: number,
  screenHeight: number
): void => {
  if (
    windowProperties.state.maximized
    || windowProperties.state.minimized
  ) return;
  windowProperties.placementMode = undefined;
  windowProperties.placement.width = Math.min(
    windowProperties.placementLimits?.maxWidth ?? screenWidth,
    Math.max(
      windowProperties.placementLimits?.minWidth ?? 256,
      width
    )
  );
  windowProperties.placement.height = Math.min(
    windowProperties.placementLimits?.maxHeight ?? screenHeight,
    Math.max(
      windowProperties.placementLimits?.minHeight ?? 48,
      height
    )
  );
}

export const moveNgwWindow = (
  windowProperties: NgwWindowProperties,
  offsetX: number,
  offsetY: number,
  screenWidth: number,
  screenHeight: number
) => {
  if (
    windowProperties.state.maximized
    || windowProperties.state.minimized
  ) return;
  if (windowProperties.placementMode !== undefined) {
    windowProperties.placement = structuredClone(windowProperties.placementBeforeAuto) as NgwWindowPlacement;
    delete windowProperties.placementBeforeAuto;
    windowProperties.placementMode = undefined;
  }
  if (windowProperties.configuration?.allowOutboundMovements) {
    windowProperties.placement.offsetX = Math.min(
      screenWidth - 32,
      Math.max(
        -windowProperties.placement.width + 32,
        offsetX
      )
    );
    windowProperties.placement.offsetY = Math.min(
      screenHeight - 16,
      Math.max(
        0,
        offsetY
      )
    );
    return;
  }
  windowProperties.placement.offsetX = Math.min(
    screenWidth - windowProperties.placement.width,
    Math.max(
      0,
      offsetX
    )
  );
  windowProperties.placement.offsetY = Math.min(
    screenHeight - windowProperties.placement.height,
    Math.max(
      0,
      offsetY
    )
  );
}

export const doNgwWindowPlacementIfPossible = (
  windowProperties: NgwWindowProperties,
  offsetX: number,
  offsetY: number,
  screenWidth: number,
  screenHeight: number,
  tolerance?: number
) => {
  if (
    windowProperties.state.maximized
    || windowProperties.state.minimized
    || !windowProperties.configuration?.allowPlacementAlignment
  ) return;
  const placementMode = getWindowPlacement(
    offsetX,
    offsetY,
    screenWidth,
    screenHeight,
    tolerance
  );
  windowProperties.placementMode = placementMode;
  if (placementMode !== undefined) {
    windowProperties.placementBeforeAuto = structuredClone(windowProperties.placement);
    windowProperties.placement = structuredClone(WindowPlacements[placementMode]);
    delete windowProperties.placement.contactPoint;
    const screenW = screenWidth / 100,
      screenH = screenHeight / 100;
    windowProperties.placement.offsetX = Math.round(
      windowProperties.placement.offsetX * screenW
    );
    windowProperties.placement.offsetY = Math.round(
      windowProperties.placement.offsetY * screenH
    );
    windowProperties.placement.width = Math.round(
      windowProperties.placement.width * screenW
    );
    windowProperties.placement.height = Math.round(
      windowProperties.placement.height * screenH
    );
  }
}
