import {TestBed} from '@angular/core/testing';

import {NgwWindowConfigurationService} from './ngw-window-configuration.service';
import {NgwWindowDefaultConfiguration} from "ngx-windows";

describe('NgwWindowConfigurationService', () => {
  let service: NgwWindowConfigurationService;

  let defaultProperties = NgwWindowDefaultConfiguration;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgwWindowConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set single property without affecting others', () => {
    service.setProperty('transparent', true);
    expect(
      service.displayProperties()
    )
      .toEqual({
        transparent: true
      });
  });

  it('should append properties without affecting others', () => {
    service.appendProperties({
      transparent: true,
      showTopBar: false,
      borderless: true
    });
    expect(
      service.displayProperties()
    )
      .toEqual({
        transparent: true,
        showTopBar: false,
        borderless: true
      });
  });

  it('should set properties', () => {
    let clonedProps = structuredClone(defaultProperties);
    clonedProps.transparent = true;
    clonedProps.showTopBar = true;
    clonedProps.borderless = true;
    service.setProperties(clonedProps);
    expect(
      service.displayProperties()
    )
      .toEqual(clonedProps);
  });

  it('should change properties with set', () => {
    let clonedProps = structuredClone(defaultProperties);
    clonedProps.transparent = true;
    clonedProps.showTopBar = true;
    clonedProps.borderless = true;
    service.setProperties(clonedProps);
    expect(
      service.displayProperties()
    )
      .not.toBe(defaultProperties);
  });
});
