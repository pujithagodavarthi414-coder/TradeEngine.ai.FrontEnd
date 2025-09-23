import * as fromShiftTiming from './shift-timing.effects';
import * as fromTimeZone from './time-zone.effects';
import * as fromBranch from './branch.effects';
import * as fromCurrency from './currency.effects';
import * as fromEmployee from './employee-list.effects';
import * as fromJobCategory from './job-category.effects';
import * as fromNotification from './notification-validator.effects';
import * as fromRoles from './roles.effects';
import * as fromSnackBar from './snackbar.effects';
import * as fromDepartMent from './department.effects';
import * as fromDesignation from './designation.effects';
import * as fromEmployementStatus from './employment-status.effects';

export const EmployeeListEffects: any = [
    fromShiftTiming.ShiftTimingListEffects,
    fromTimeZone.TimeZoneListEffects,
    fromBranch.BranchEffects,
    fromCurrency.CurrencyEffects,
    fromEmployee.EmployeeListEffects,
    fromJobCategory.JobCategoryEffects,
    fromNotification.NotificationValidatorEffects,
    fromRoles.RolesEffects,
    fromSnackBar.SnackbarEffects,
    fromDepartMent.DepartmentListEffects,
    fromEmployementStatus.EmploymentStatusListEffects,
    fromDepartMent.DepartmentListEffects,
    fromDesignation.DesignationListEffects
]