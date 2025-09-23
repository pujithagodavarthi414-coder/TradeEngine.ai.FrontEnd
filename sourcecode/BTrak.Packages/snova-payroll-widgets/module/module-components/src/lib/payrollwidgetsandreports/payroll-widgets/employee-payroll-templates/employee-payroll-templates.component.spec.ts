import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePayrollTemplatesComponent } from './employee-payroll-templates.component';

describe('EmployeePayrollTemplatesComponent', () => {
  let component: EmployeePayrollTemplatesComponent;
  let fixture: ComponentFixture<EmployeePayrollTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeePayrollTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeePayrollTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
