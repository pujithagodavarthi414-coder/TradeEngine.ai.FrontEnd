import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollRunComponent } from './payroll-run.component';

describe('PayrollRunComponent', () => {
  let component: PayrollRunComponent;
  let fixture: ComponentFixture<PayrollRunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollRunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
