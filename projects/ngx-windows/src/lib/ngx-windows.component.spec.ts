import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxWindowsComponent } from './ngx-windows.component';

describe('NgxWindowsComponent', () => {
  let component: NgxWindowsComponent;
  let fixture: ComponentFixture<NgxWindowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxWindowsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxWindowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
