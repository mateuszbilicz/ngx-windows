import {NgwWindowConfiguration, NgwWindowProps} from "../models/ngw-window-properties.model";
import {getWindowPlacement} from "./ngw-window-placement.api";
import {NgwWindowBasicPlacement, NgwWindowPlacement, WindowPlacements} from "../models/placement.model";
import {NgwWindowPlacementService} from "../ngw-window/services/ngw-window-placement.service";
import {NgwWindowStateService} from "../ngw-window/services/ngw-window-state.service";
import {NgwWindowConfigurationService} from "../ngw-window/services/ngw-window-configuration.service";

export const NgwWindowDefaultPlacement: NgwWindowBasicPlacement = {
  offsetX: 30,
  offsetY: 30,
  width: 50,
  height: 50
}

export const NgwWindowDefaultConfiguration: NgwWindowConfiguration = {
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
}

export const createNgwWindowPropertiesDefaults = (): NgwWindowProps => {
  return {
    id: `${Date.now().toString(36)}-${Math.floor(Math.random() * 9999).toString(36)}`,
    name: 'New window',
    component: null
  }
}

export const resizeNgwWindow = (
  placementService: NgwWindowPlacementService,
  stateService: NgwWindowStateService,
  width: number,
  height: number,
  screenWidth: number,
  screenHeight: number
): void => {
  if (
    stateService.maximized()
    || stateService.minimized()
  ) return;
  placementService.placementMode.set(undefined);
  placementService.setWH(
    Math.min(
      placementService.maxWidth() ?? screenWidth,
      Math.max(
        placementService.minWidth() ?? 256,
        width
      )
    ),
    Math.min(
      placementService.maxHeight() ?? screenHeight,
      Math.max(
        placementService.minHeight() ?? 48,
        height
      )
    )
  );
}

export const moveNgwWindow = (
  placementService: NgwWindowPlacementService,
  stateService: NgwWindowStateService,
  configurationService: NgwWindowConfigurationService,
  offsetX: number,
  offsetY: number,
  screenWidth: number,
  screenHeight: number
) => {
  if (
    stateService.maximized()
    || stateService.minimized()
  ) return;
  if (placementService.placementMode() !== undefined) {
    let newPlacement = structuredClone(placementService.placementBeforeAuto()) as NgwWindowPlacement;
    placementService.setAll(
      newPlacement.width,
      newPlacement.height,
      newPlacement.offsetX,
      newPlacement.offsetY
    );
    placementService.placementBeforeAuto.set(undefined);
    placementService.placementMode.set(undefined);
  }
  if (configurationService.allowOutboundMovements()) {
    placementService.setOffset(
      Math.min(
        screenWidth - 32,
        Math.max(
          -placementService.width() + 32,
          offsetX
        )
      ),
      Math.min(
        screenHeight - 16,
        Math.max(
          0,
          offsetY
        )
      )
    );
    return;
  }
  placementService.setOffset(
    Math.min(
      screenWidth - placementService.width(),
      Math.max(
        0,
        offsetX
      )
    ),
    Math.min(
      screenHeight - placementService.height(),
      Math.max(
        0,
        offsetY
      )
    )
  )
}

export const doNgwWindowPlacementIfPossible = (
  placementService: NgwWindowPlacementService,
  stateService: NgwWindowStateService,
  configurationService: NgwWindowConfigurationService,
  offsetX: number,
  offsetY: number,
  screenWidth: number,
  screenHeight: number,
  tolerance?: number
) => {
  if (
    stateService.maximized()
    || stateService.minimized()
    || !configurationService.allowPlacementAlignment()
  ) return;
  const placementMode = getWindowPlacement(
    offsetX,
    offsetY,
    screenWidth,
    screenHeight,
    tolerance
  );
  placementService.placementMode.set(placementMode);
  if (placementMode !== undefined) {
    placementService.placementBeforeAuto.set(structuredClone(
      placementService.getPlacementObject()
    ));
    const newPlacementInPercent = WindowPlacements[placementMode],
      screenW = screenWidth / 100,
      screenH = screenHeight / 100;
    placementService.setAll(
      Math.round(
        newPlacementInPercent.width * screenW
      ),
      Math.round(
        newPlacementInPercent.height * screenH
      ),
      Math.round(
        newPlacementInPercent.offsetX * screenW
      ),
      Math.round(
        newPlacementInPercent.offsetY * screenH
      )
    );
  }
}
