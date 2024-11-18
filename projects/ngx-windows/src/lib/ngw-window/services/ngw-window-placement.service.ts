import {Injectable, signal} from '@angular/core';
import {NgwWindowPlacement, WindowPlacementsKeyName} from "../../models/placement.model";

@Injectable({
  providedIn: 'root'
})
/**
 * @class NgwWindowPlacementService
 * @description Service to control placement and size. Provided in and used by NgwWindowComponent.
 */
export class NgwWindowPlacementService {
  /**
   * @property placementMode
   * @description Current window placement mode.
   * @default undefined
   */
  placementMode = signal<WindowPlacementsKeyName | undefined>(undefined);

  /**
   * @property placementBeforeAuto
   * @description Window placement before alignment.
   * @default undefined
   */
  placementBeforeAuto = signal<NgwWindowPlacement | undefined>(undefined);

  /**
   * @property width
   * @description Window width.
   * @default 0
   */
  width = signal<number>(0);

  /**
   * @property height
   * @description Window height.
   * @default 0
   */
  height = signal<number>(0);

  /**
   * @property offsetX
   * @description Window X position.
   * @default 0
   */
  offsetX = signal<number>(0);

  /**
   * @property offsetY
   * @description Window Y position.
   * @default 0
   */
  offsetY = signal<number>(0);

  /**
   * @property minWidth
   * @description Window minimum width.
   * @default 256
   */
  minWidth = signal<number>(256);

  /**
   * @property maxWidth
   * @description Window maximum width.
   * @default Infinity
   */
  maxWidth = signal<number>(Infinity);

  /**
   * @property minHeight
   * @description Window minimum height.
   * @default 48
   */
  minHeight = signal<number>(48);

  /**
   * @property maxHeight
   * @description Window maximum height.
   * @default Infinity
   */
  maxHeight = signal<number>(Infinity);

  /**
   * @function setWH
   * @description Sets window width and height.
   * @param width - window width
   * @param height - window height
   * @returns void
   */
  setWH(width: number, height: number) {
    this.width.set(width);
    this.height.set(height);
  }

  /**
   * @function setOffset
   * @description Set window XY position.
   * @param offsetX - window X position
   * @param offsetY - window Y position
   * @returns void
   */
  setOffset(offsetX: number, offsetY: number) {
    this.offsetX.set(offsetX);
    this.offsetY.set(offsetY);
  }

  /**
   * @function setAll
   * @description Sets all window placement properties.
   * @param width - window width
   * @param height - window height
   * @param offsetX - window X position
   * @param offsetY - window Y position
   * @returns void
   */
  setAll(width: number, height: number, offsetX: number, offsetY: number) {
    this.width.set(width);
    this.height.set(height);
    this.offsetX.set(offsetX);
    this.offsetY.set(offsetY);
  }

  /**
   * @function getPlacementObject
   * @description Current window placement object.
   * @returns NgwWindowPlacement
   */
  getPlacementObject(): NgwWindowPlacement {
    return {
      offsetX: this.offsetX(),
      offsetY: this.offsetY(),
      width: this.width(),
      height: this.height()
    }
  }
}
