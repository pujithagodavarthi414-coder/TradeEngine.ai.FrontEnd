import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollStatusComponent } from './payroll-status.component';

describe('PayrollStatusComponent', () => {
  let component: PayrollStatusComponent;
  let fixture: ComponentFixture<PayrollStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
