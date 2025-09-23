import * as fromLeaveType from './leave-frequency.effects'
import * as fromLeaveFrequency from './leave-types.effects'
import * as fromLeaveApplicability from './leave-applicability.effects'
import * as fromLeaves from './leaves.effects'
import * as fromLeaveOverViewList from './leaves-overview.effects'
import * as fromNotificationEffects from './notification-validator.effects';

export const LeaveManagementEffects: any = [
    fromLeaveType.LeaveFrequencyTypesEffects,
    fromLeaveFrequency.LeaveFrequencyEffects,
    fromLeaveApplicability.LeaveApplicabilityEffects,
    fromLeaves.LeavesEffects,
    fromLeaveOverViewList.LeavesOverviewEffects,
    fromNotificationEffects.NotificationValidatorEffects
];