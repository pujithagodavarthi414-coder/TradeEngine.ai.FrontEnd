import * as fromCurrency from './currency.effects';
import * as fromBranches from './branch.effects';
import * as fromAuthencation from './authentication.effects';
import * as fromUsers from './users.effects';
import * as fromSoftLabelEffects from './soft-labels.effects';
import * as fromEmployeeList from './employee-list.effects';

export const allAssetModuleEffects: any = [
    fromCurrency.CurrencyEffects,
    fromBranches.BranchEffects,
    fromUsers.UserEffects,
    fromAuthencation.AuthenticationEffects,
    fromSoftLabelEffects.SoftLabelConfigurationEffects,
    fromEmployeeList.EmployeeListEffects,
]; 