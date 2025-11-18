import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisLecturasPage } from './mis-lecturas.page';

describe('MisLecturasPage', () => {
  let component: MisLecturasPage;
  let fixture: ComponentFixture<MisLecturasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MisLecturasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
