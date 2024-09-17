import {Injectable, signal} from '@angular/core';
import {NgwWindowPlacement, WindowPlacementsKeyName} from "../../models/placement.model";

@Injectable({
  providedIn: 'root'
})
export class NgwWindowPlacementService {
  placementMode = signal<WindowPlacementsKeyName | undefined>(undefined);
  placementBeforeAuto = signal<NgwWindowPlacement | undefined>(undefined);
  width = signal<number>(0);
  height = signal<number>(0);
  offsetX = signal<number>(0);
  offsetY = signal<number>(0);
  minWidth = signal<number>(256);
  maxWidth = signal<number>(Infinity);
  minHeight = signal<number>(48);
  maxHeight = signal<number>(Infinity);


  setWH(width: number, height: number) {
    this.width.set(width);
    this.height.set(height);
  }

  setOffset(offsetX: number, offsetY: number) {
    this.offsetX.set(offsetX);
    this.offsetY.set(offsetY);
  }

  setAll(width: number, height: number, offsetX: number, offsetY: number) {
    this.width.set(width);
    this.height.set(height);
    this.offsetX.set(offsetX);
    this.offsetY.set(offsetY);
  }

  getPlacementObject(): NgwWindowPlacement {
    return {
      offsetX: this.offsetX(),
      offsetY: this.offsetY(),
      width: this.width(),
      height: this.height()
    }
  }
}
