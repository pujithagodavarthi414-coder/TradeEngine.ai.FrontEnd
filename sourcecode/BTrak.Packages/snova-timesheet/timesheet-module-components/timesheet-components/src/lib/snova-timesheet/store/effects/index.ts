import * as fromEmployeeList from '../effects/feedTimeSheet.effects';
import * as fromPermissionHistory from '../effects/permission-history.effects';
import * as fromValidations from '../effects/notification-validator.effects';

export const allAssetModuleEffects: any = [
    fromEmployeeList.FeedTimeSheetUsersEffects,
    fromPermissionHistory.PermissionHistoryUsersEffects,
    fromValidations.NotificationValidatorEffects
]; 