import * as fromTeamLeadEffects from "./team-leads.effects";
import * as fromUserProfileEffects from './user-profile.effects';
import * as fromAuthencation from './authentication.effects';
import * as fromBranches from './branch.effects';
import * as fromWorkspaces from './workspaces.effects';
import * as fromProjects from "./projects.effects";
import * as fromLeaves from './leaves.effects';
import * as fromLeaveFrequency from './leave-types.effects';
import * as fromUserStoryTypesEffects from "./userstory-types.effects";
import * as fromBoardTypes from "./board-types.effects";
import * as fromNotificationVlaidator from './notification-validator.effects';
import * as fromSnackbar from "./snackbar.effects";
import * as fromChangePassword from "./change-password.effects";
import * as fromCanteenPurchase from "./canteen-purchase.effects";
import * as fromEmployeeList from "./employee-list.effects";

export const allDashboardModuleEffects: any = [
    fromTeamLeadEffects.TeamLeadEffects,
    fromUserProfileEffects.UserProfileEffects,
    fromAuthencation.AuthenticationEffects,
    fromBranches.BranchEffects,
    fromWorkspaces.WorkspaceEffects,
    fromProjects.ProjectEffects,
    fromLeaves.LeavesEffects,
    fromLeaveFrequency.LeaveFrequencyEffects,
    fromUserStoryTypesEffects.UserStoryTypesEffects,
    fromBoardTypes.BoardTypesEffects,
    fromNotificationVlaidator.NotificationValidatorEffects,
    fromSnackbar.SnackbarEffects,
    fromChangePassword.ChangePasswordEffects,
    fromCanteenPurchase.CanteenPurchaseItemEffects,
    fromEmployeeList.EmployeeListEffects
];