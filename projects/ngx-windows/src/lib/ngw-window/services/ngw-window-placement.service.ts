import {Injectable, signal} from '@angular/core';
import {WindowPlacementsKeyName} from "../../models/placement.model";

@Injectable({
  providedIn: 'root'
})
export class NgwWindowPlacementService {
  placementMode = signal<WindowPlacementsKeyName | undefined>(undefined);
  width = signal<number>(0);
  height = signal<number>(0);
  offsetX = signal<number>(0);
  offsetY = signal<number>(0);
}
