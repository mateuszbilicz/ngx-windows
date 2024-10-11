import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveWindowsBarComponent } from './active-windows-bar.component';

describe('ActiveWindowsBarComponent', () => {
  let component: ActiveWindowsBarComponent;
  let fixture: ComponentFixture<ActiveWindowsBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveWindowsBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveWindowsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
