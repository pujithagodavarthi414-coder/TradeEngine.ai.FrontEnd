import * as fromCurrency from './currency.effects';
import * as fromJobOpeningStatus from './job-opening-status.effects';
import * as fromBranches from './branch.effects';
import * as fromAuthencation from './authentication.effects';
import * as fromUsers from './users.effects';
import * as fromSoftLabelEffects from './soft-labels.effects';
import * as fromEmployeeList from './employee-list.effects';
import * as fromUserDropDown from './users-dropdown.effects';
import * as fromHiringStatus from './hiring-status.effects';
import * as fromJobOpening from './job-opening.effects';
import * as fromCandidates from './candidate.effects';
import * as fromNotifications from './notification-validator.effects';

export const allRecuitmentModuleEffects: any = [
    fromCurrency.CurrencyEffects,
    fromJobOpeningStatus.JobOpeningStatusEffects,
    fromBranches.BranchEffects,
    fromUsers.UserEffects,
    fromAuthencation.AuthenticationEffects,
    fromSoftLabelEffects.SoftLabelConfigurationEffects,
    fromEmployeeList.EmployeeListEffects,
    fromUserDropDown.UsersEffects,
    fromHiringStatus.HiringStatusEffects,
    fromJobOpening.JobOpeningEffects,
    fromCandidates.CandidateEffects,
    fromNotifications.NotificationValidatorEffects
];
