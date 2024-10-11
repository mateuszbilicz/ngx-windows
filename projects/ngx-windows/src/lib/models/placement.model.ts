export interface NgwWindowPlacementContactPoint {
  xP: number;
  yP: number;
}

export interface NgwWindowBasicPlacement {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
}

export interface NgwWindowPlacement
  extends NgwWindowBasicPlacement {
  contactPoint?: NgwWindowPlacementContactPoint;
}

export const NgwWindowPlacementCornerLeftTop: NgwWindowPlacement = {
  offsetX: 0, offsetY: 0, width: 50, height: 50,
  contactPoint: {xP: 0, yP: 0}
}

export const NgwWindowPlacementCornerRightTop: NgwWindowPlacement = {
  offsetX: 50, offsetY: 0, width: 50, height: 50,
  contactPoint: {xP: 100, yP: 0}
}

export const NgwWindowPlacementCornerLeftBottom: NgwWindowPlacement = {
  offsetX: 0, offsetY: 50, width: 50, height: 50,
  contactPoint: {xP: 0, yP: 100}
}

export const NgwWindowPlacementCornerRightBottom: NgwWindowPlacement = {
  offsetX: 50, offsetY: 50, width: 50, height: 50,
  contactPoint: {xP: 100, yP: 100}
}

export const NgwWindowPlacementFullTop: NgwWindowPlacement = {
  offsetX: 0, offsetY: 0, width: 100, height: 50,
  contactPoint: {xP: 75, yP: 0}
}

export const NgwWindowPlacementFullBottom: NgwWindowPlacement = {
  offsetX: 0, offsetY: 50, width: 100, height: 50,
  contactPoint: {xP: 50, yP: 100}
}

export const NgwWindowPlacementFullLeft: NgwWindowPlacement = {
  offsetX: 0, offsetY: 0, width: 50, height: 100,
  contactPoint: {xP: 0, yP: 50}
}

export const NgwWindowPlacementFullRight: NgwWindowPlacement = {
  offsetX: 50, offsetY: 0, width: 50, height: 100,
  contactPoint: {xP: 100, yP: 50}
}

export const NgwWindowPlacementFullScreen: NgwWindowPlacement = {
  offsetX: 0, offsetY: 0, width: 100, height: 100,
  contactPoint: {xP: 50, yP: 0}
}

export type WindowPlacementsKeyName = 'cornerLeftTop'
  | 'cornerRightTop'
  | 'cornerLeftBottom'
  | 'cornerRightBottom'
  | 'fullTop'
  | 'fullBottom'
  | 'fullLeft'
  | 'fullRight'
  | 'fullScreen';

export const WindowPlacements = {
  cornerLeftTop: NgwWindowPlacementCornerLeftTop,
  cornerRightTop: NgwWindowPlacementCornerRightTop,
  cornerLeftBottom: NgwWindowPlacementCornerLeftBottom,
  cornerRightBottom: NgwWindowPlacementCornerRightBottom,
  fullTop: NgwWindowPlacementFullTop,
  fullBottom: NgwWindowPlacementFullBottom,
  fullLeft: NgwWindowPlacementFullLeft,
  fullRight: NgwWindowPlacementFullRight,
  fullScreen: NgwWindowPlacementFullScreen
}

export interface WindowPlacementArrayEntry {
  key: WindowPlacementsKeyName;
  placement: NgwWindowPlacement;
}

export const WindowPlacementsArray: WindowPlacementArrayEntry[] = [
  {key: 'cornerLeftTop', placement: NgwWindowPlacementCornerLeftTop},
  {key: 'cornerRightTop', placement: NgwWindowPlacementCornerRightTop},
  {key: 'cornerLeftBottom', placement: NgwWindowPlacementCornerLeftBottom},
  {key: 'cornerRightBottom', placement: NgwWindowPlacementCornerRightBottom},
  {key: 'fullTop', placement: NgwWindowPlacementFullTop},
  {key: 'fullBottom', placement: NgwWindowPlacementFullBottom},
  {key: 'fullLeft', placement: NgwWindowPlacementFullLeft},
  {key: 'fullRight', placement: NgwWindowPlacementFullRight},
  {key: 'fullScreen', placement: NgwWindowPlacementFullScreen}
];
