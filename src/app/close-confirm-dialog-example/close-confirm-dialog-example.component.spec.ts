import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CloseConfirmDialogExampleComponent} from './close-confirm-dialog-example.component';
import {NgwWindowControllerService} from "ngx-windows";

describe('CloseConfirmDialogExampleComponent', () => {
  let component: CloseConfirmDialogExampleComponent;
  let fixture: ComponentFixture<CloseConfirmDialogExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloseConfirmDialogExampleComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CloseConfirmDialogExampleComponent);

    const ngwWindowControllerService = TestBed.inject(NgwWindowControllerService)
    component = fixture.componentInstance;
    fixture.componentRef.setInput('windowController', ngwWindowControllerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
