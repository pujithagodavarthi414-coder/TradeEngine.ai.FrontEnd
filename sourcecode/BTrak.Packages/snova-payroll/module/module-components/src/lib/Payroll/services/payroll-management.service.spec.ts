import { TestBed } from '@angular/core/testing';

import { PayrollManagementService } from './payroll-management.service';

describe('PayrollManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PayrollManagementService = TestBed.get(PayrollManagementService);
    expect(service).toBeTruthy();
  });
});
