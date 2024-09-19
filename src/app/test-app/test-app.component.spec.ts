import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAppComponent } from './test-app.component';
import {NgwWindowControllerService} from "ngx-windows/src/lib/ngw-window/services/ngw-window-controller.service";

describe('TestAppComponent', () => {
  let component: TestAppComponent;
  let fixture: ComponentFixture<TestAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestAppComponent]
    })
    .compileComponents();
    const ngwWindowControllerService = TestBed.inject(NgwWindowControllerService);
    fixture = TestBed.createComponent(TestAppComponent);
    fixture.componentRef.setInput('windowController', ngwWindowControllerService);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
