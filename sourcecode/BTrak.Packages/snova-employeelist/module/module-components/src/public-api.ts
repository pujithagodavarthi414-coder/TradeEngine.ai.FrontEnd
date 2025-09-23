/*
 * Public API Surface of my-counter
 */
export * from './lib/employeeList/employeeList.module';

import { EmployeeInductionComponent } from './lib/employeeList/components/induction-work-items/employee-induction.component';
import { InductionConfigurationComponent } from './lib/employeeList/components/induction-work-items/induction-configuration.component';
import { InductionWorItemDialogComponent } from './lib/employeeList/components/induction-work-items/induction-workitem-dialog.component';
import { EmployeeListComponent } from './lib/employeeList/components/employee-list.component';
import { EmployeeUploadPopupComponent } from './lib/employeeList/components/employee-upload';
import { EmployeeListPageComponent } from './lib/employeeList/components/employeeList.page';
import { EmployeeListRouting } from './lib/employeeList/employeeList.routing';
import { leavesComponent } from './lib/employeeList/components/leaves.component';
import { payrollComponent } from './lib/employeeList/components/payroll.component';
import { HrAreaSettingsComponent } from './lib/employeeList/components/area-settings.component';
import { HrAreaComponent } from './lib/employeeList/components/hr-area-component';
import { EmployeeModulesService } from './lib/employeeList/services/employee_module.service';

export { EmployeeInductionComponent };
export { InductionConfigurationComponent };
export { InductionWorItemDialogComponent };
export { EmployeeListComponent };
export { EmployeeUploadPopupComponent };
export { EmployeeListPageComponent };
export{ payrollComponent }
export{ leavesComponent }
export{ HrAreaSettingsComponent }
export{ HrAreaComponent }
export { EmployeeListRouting }
export * from './lib/employeeList/store/actions/employee-list.action';
export * from './lib/employeeList/store/actions/roles.action';

// Reducers
export * from './lib/employeeList/store/reducers/index';
// Reducers
export { EmployeeModulesService }