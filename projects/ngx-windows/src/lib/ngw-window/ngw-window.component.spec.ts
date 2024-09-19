import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgwWindowComponent } from './ngw-window.component';
import {NgwWindowProps} from "../models/ngw-window-properties.model";
import {TestAppComponent} from "../../../../../src/app/test-app/test-app.component";

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
    fixture.componentRef.setInput('properties', {id: '0', component: TestAppComponent, name: 'Test window'} as NgwWindowProps);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
