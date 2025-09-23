import * as fromFoodOrders from './food-order.effects';
import * as fromRecentIndividualFoodOrders from './recent-individual-food-orders.effects';
import * as fromFoodOrderStatus from './food-order-status.effects';
import * as fromCurrency from './currency.effects';
import * as fromStoreConfiguration from './store-configurations.effects';
import * as fromSoftLabels from './soft-labels.effects';
import * as fromSnackBar from './snackbar.effects';
import * as fromNotification from  './notification-validator.effects';

export const FoodOrderEffects: any = [
    fromFoodOrders.FoodOrderEffects,
    fromRecentIndividualFoodOrders.RecentIndividualFoodOrderEffects,
    fromFoodOrderStatus.FoodOrderEffects,
    fromCurrency.CurrencyEffects,
    fromStoreConfiguration.StoreConfigurationEffects,
    fromSoftLabels.SoftLabelConfigurationEffects,
    fromSnackBar.SnackbarEffects,
    fromNotification.NotificationValidatorEffects
]