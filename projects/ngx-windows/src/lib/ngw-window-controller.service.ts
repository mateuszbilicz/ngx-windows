import '@angular/compiler';
import {Injectable, TemplateRef} from '@angular/core';
import {NgwWindowComponent} from "./ngw-window/ngw-window.component";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NgwWindowControllerService {
  instance?: NgwWindowComponent;
  onMenu$: Subject<MouseEvent> = new Subject<MouseEvent>();
  onClose$: Subject<MouseEvent> = new Subject<MouseEvent>();
  leftControlsTemplate?: TemplateRef<any>;
  rightControlsTemplate?: TemplateRef<any>;
  windowNameTemplate?: TemplateRef<any>;
}
