import * as fromSuppliers from './suppliers.effects';
import * as fromLocations from './locations.effects';
import * as fromCurrency from './currency.effects';
import * as fromDamagedAssets from './damaged-assets.effects';
import * as fromAssignedAssets from './assigned-assets.effects';
import * as fromAssetsAllocatedToMe from './assets-allocated-to-me.effects';
import * as fromProducts from './products.effects';
import * as fromProductDetails from './product-details.effects';
import * as fromAssets from './assets.effects';
import * as fromBranches from './branch.effects';
import * as fromAssetsCommentsAndHistory from './assetsCommentsAndHistory.effects';
import * as fromAuthencation from './authentication.effects';
import * as fromUsers from './users.effects';
import * as fromSoftLabelEffects from './soft-labels.effects';
import * as fromEmployeeList from './employee-list.effects';
import * as fromNotificationVlaidator from './notification-validator.effects';
import * as fromSnackbar from './snackbar.effects';
import * as fromUserDropDown from './users-dropdown.effects';

export const allAssetModuleEffects: any = [
    fromSuppliers.SupplierEffects,
    fromLocations.LocationEffects,
    fromCurrency.CurrencyEffects,
    fromDamagedAssets.DamagedAssetsEffects,
    fromAssignedAssets.AssignedAssetsEffects,
    fromAssetsAllocatedToMe.AssetsAllocatedToMeEffects,
    fromProducts.ProductEffects,
    fromProductDetails.ProductDetailsEffects,
    fromAssets.AssetEffects,
    fromBranches.BranchEffects,
    fromUsers.UserEffects,
    fromAssetsCommentsAndHistory.AssetsCommentsAndHistoryEffects,
    fromAuthencation.AuthenticationEffects,
    fromSoftLabelEffects.SoftLabelConfigurationEffects,
    fromEmployeeList.EmployeeListEffects,
    fromNotificationVlaidator.NotificationValidatorEffects,
    fromSnackbar.SnackbarEffects,
    fromUserDropDown.UsersEffects,
]; 