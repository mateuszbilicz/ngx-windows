import {NgwWindowControllerService} from "../ngw-window/services/ngw-window-controller.service";
import {Subject} from "rxjs";

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

export interface NgwWindowPropsWithoutId {
  name: string;
  component: any;
}

export interface NgwWindowProps
  extends NgwWindowPropsWithoutId {
  id: string;
}

export interface NgwWindowPropsWithService
  extends NgwWindowProps {
  service: NgwWindowControllerService | undefined;
}

export interface ActiveNgwWindowProps
  extends NgwWindowPropsWithService {
  onRegister$: Subject<NgwWindowControllerService>;
}
