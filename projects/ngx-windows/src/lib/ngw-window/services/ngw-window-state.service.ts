import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NgwWindowStateService {
  minimized = signal<boolean>(false);
  maximized = signal<boolean>(false);
  focused = signal<boolean>(false);
  locked = signal<boolean>(false);
}
