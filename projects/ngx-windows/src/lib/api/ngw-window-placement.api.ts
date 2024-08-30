import {distance2D} from "./ngw-window-util";
import {
  NgwWindowBasicPlacement,
  WindowPlacements,
  WindowPlacementsArray,
  WindowPlacementsKeyName
} from "../models/placement.model";

export const getWindowPlacement = (
  x: number,
  y: number,
  screenW: number,
  screenH: number,
  tolerance = 64
): WindowPlacementsKeyName | undefined => {
  const screenWP = screenW / 100,
    screenHP = screenH / 100;
  return WindowPlacementsArray.map(entry => ({
    key: entry.key,
    distance: distance2D(
      x,
      y,
      (entry.placement.contactPoint?.xP ?? entry.placement.offsetX) * screenWP,
      (entry.placement.contactPoint?.yP ?? entry.placement.offsetY) * screenHP
    )
  }))
    .filter(entry => entry.distance <= tolerance)
    .sort((a, b) => a.distance - b.distance)
    [0]?.key ?? undefined;
}

export const calculatePlacementOfKey = (
  key: WindowPlacementsKeyName,
  screenW: number,
  screenH: number
): NgwWindowBasicPlacement => {
  const placement = WindowPlacements[key];
  return {
    offsetX: placement.offsetX * screenW,
    offsetY: placement.offsetY * screenH,
    width: placement.width * screenW,
    height: placement.height * screenH
  }
}
