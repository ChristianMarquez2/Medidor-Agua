import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminRegistrosPage } from './admin-registros.page';

describe('AdminRegistrosPage', () => {
  let component: AdminRegistrosPage;
  let fixture: ComponentFixture<AdminRegistrosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRegistrosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
