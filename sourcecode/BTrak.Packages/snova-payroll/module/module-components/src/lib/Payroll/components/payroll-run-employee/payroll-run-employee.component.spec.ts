import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollRunEmployeeComponent } from './payroll-run-employee.component';

describe('PayrollRunEmployeeComponent', () => {
  let component: PayrollRunEmployeeComponent;
  let fixture: ComponentFixture<PayrollRunEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollRunEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollRunEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
