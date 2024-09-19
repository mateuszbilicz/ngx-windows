import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CloseConfirmDialogComponent} from './close-confirm-dialog.component';
import {NgwWindowControllerService} from "ngx-windows/src/lib/ngw-window/services/ngw-window-controller.service";
import {signal} from "@angular/core";

describe('CloseConfirmDialogComponent', () => {
  let component: CloseConfirmDialogComponent;
  let fixture: ComponentFixture<CloseConfirmDialogComponent>;
  let isParentLocked = false;
  const confirmClose = signal<boolean>(false);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloseConfirmDialogComponent]
    })
      .compileComponents();
    const ngwWindowControllerService = TestBed.inject(NgwWindowControllerService);
    ngwWindowControllerService.properties.set({
      id: '0',
      component: CloseConfirmDialogComponent,
      name: 'Close confirm dialog'
    });

    ngwWindowControllerService.data.set({
      lockParent: () => {
        isParentLocked = true;
      },
      unlockParent: () => {
        isParentLocked = false;
      },
      confirmClose: confirmClose
    });

    fixture = TestBed.createComponent(CloseConfirmDialogComponent);
    fixture.componentRef.setInput('windowController', ngwWindowControllerService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have id', () => {
    expect(component.windowController().id()).toBeTruthy();
  });

  it('Parent should be locked after init', () => {
    expect(isParentLocked).toBe(true);
  });

  it('Parent should be unlocked after cancel', () => {
    fixture.nativeElement.querySelector('.secondary').click();
    expect(isParentLocked).toBe(false);
  });

  it('Parent should be closed after confirm', () => {
    fixture.nativeElement.querySelector('button:not(button.secondary)').click();
    expect(confirmClose()).toBe(true);
  });
});
