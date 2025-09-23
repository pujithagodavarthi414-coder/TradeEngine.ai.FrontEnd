import * as fromCanteenFoodItems from './canteen-food-item.effects';
import * as fromCanteenPurchaseFoodItems from './canteen-purchase-food-item.effects';
import * as fromCanteenCredits from './canteen-credit.effects';
import * as fromCanteenPurchaseItems from './canteen-purchase-item.effects';
import * as fromCanteenBalance from './canteen-balance.effects';
import * as fromCurrency from './currency.effects';
import * as fromUsersDropDown from './users.effects';
import * as fromNotification from './notification-validator.effects';
import * as fromSoftLabels from './soft-labels.effects';
import * as fromSnackBar from './snackbar.effects';
import * as fromBranch from './branch.effects';

export const CanteenModuleEffects: any = [
    fromCanteenFoodItems.FoodItemEffects,
    fromCanteenPurchaseFoodItems.PurchaseFoodItemEffects,
    fromCanteenCredits.CanteenCreditEffects,
    fromCanteenPurchaseItems.CanteenPurchaseItemEffects,
    fromCanteenBalance.CanteenBalanceEffects,
    fromCurrency.CurrencyEffects,
    fromUsersDropDown.UsersEffects,
    fromNotification.NotificationValidatorEffects,
    fromSoftLabels.SoftLabelConfigurationEffects,
    fromSnackBar.SnackbarEffects,
    fromBranch.BranchEffects
]