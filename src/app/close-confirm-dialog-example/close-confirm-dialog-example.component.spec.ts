import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseConfirmDialogExampleComponent } from './close-confirm-dialog-example.component';

describe('CloseConfirmDialogExampleComponent', () => {
  let component: CloseConfirmDialogExampleComponent;
  let fixture: ComponentFixture<CloseConfirmDialogExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloseConfirmDialogExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseConfirmDialogExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
