import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgwWindowComponent } from './ngw-window.component';

describe('NgwWindowComponent', () => {
  let component: NgwWindowComponent;
  let fixture: ComponentFixture<NgwWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgwWindowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgwWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
