import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IconComponent} from './icon.component';

describe('IconComponent', () => {
  let component: IconComponent;
  let fixture: ComponentFixture<IconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be close icon', () => {
    component.type = 'close';
    expect(component.iconSvgHTML).toBe(
      '<path d="M3 3L13 13M13 3L3 13" stroke="white" stroke-width="2"/>'
    );
  });

  it('should be menu icon', () => {
    component.type = 'menu';
    expect(component.iconSvgHTML).toBe(
      `<path d="M3 12H13" stroke="white" stroke-width="2"/>
<path d="M3 8H13" stroke="white" stroke-width="2"/>
<path d="M3 4H13" stroke="white" stroke-width="2"/>`
    );
  });

  it('should be minimize icon', () => {
    component.type = 'minimize';
    expect(component.iconSvgHTML).toBe(
      '<path d="M3 13H13" stroke="white" stroke-width="2"/>'
    );
  });

  it('should be maximize icon', () => {
    component.type = 'maximize';
    expect(component.iconSvgHTML).toBe(
      '<path fill-rule="evenodd" clip-rule="evenodd" d="M6.82843 4H10.5858L9.29289 5.29289L10.7071 6.70711L12 5.41421V9.17157L14 11.1716V3V2H13H4.82843L6.82843 4ZM2 4.82843V13V14H3H11.1716L9.17157 12H5.41421L6.70711 10.7071L5.29289 9.29289L4 10.5858V6.82843L2 4.82843Z" fill="white"/>'
    );
  });

  it('should be restore icon', () => {
    component.type = 'restore';
    expect(component.iconSvgHTML).toBe(
      '<path d="M10 2V6H14M6 14V10H2" stroke="white" stroke-width="2"/>'
    );
  });

});
