import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroLecturaPage } from './registro-lectura.page';

describe('RegistroLecturaPage', () => {
  let component: RegistroLecturaPage;
  let fixture: ComponentFixture<RegistroLecturaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroLecturaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
