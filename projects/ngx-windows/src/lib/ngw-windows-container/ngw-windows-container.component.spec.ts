import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NgwWindowsContainerComponent} from './ngw-windows-container.component';

describe('NgwWindowsContainerComponent', () => {
  let component: NgwWindowsContainerComponent;
  let fixture: ComponentFixture<NgwWindowsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgwWindowsContainerComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NgwWindowsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
