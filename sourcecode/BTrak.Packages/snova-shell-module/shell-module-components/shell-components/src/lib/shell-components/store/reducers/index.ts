import { ActionReducerMap, createFeatureSelector, createSelector, MemoizedSelector } from "@ngrx/store";
import { MemoizedSelectorWithProps } from '@ngrx/store/src/selector';
import { Dictionary } from '@ngrx/entity';

import { UserModel } from '../../models/user';
import { ThemeModel } from '../../models/themes.model';
import { IMenuItem } from '../../models/IMenuItem';
import { NotificationOutputModel } from '../../models/NotificationsOutPutModel';

import * as _ from "underscore";

import * as fromRoot from "../../../../store/reducers/index";

import * as fromAuthentication from "./authentication.reducers";
import * as fromMenuItems from "./menuitems.reducers";
import { EntityRoleFeatureModel } from '../../models/entityRoleFeature';
import { TimesheetDisableorEnable } from '../../models/timesheetenabledisable';
import * as fromNotifications from "./notifications.reducers";
import * as fromNotificationValidator from "./notification-validator.reducers";
import * as fromChatMessenger from "./chat.reducers";
// import * as fromTags from "./tags.reducers";

// tslint:disable-next-line: interface-name
export interface SharedModuleState {
  notifications: fromNotifications.State;
  authenticationRecord: fromAuthentication.State;
  menuItems: fromMenuItems.State;
  notificationValidator: fromNotificationValidator.State;
  chatMessenger: fromChatMessenger.State;
  // tags: fromTags.State;
}

// tslint:disable-next-line: interface-name
export interface State extends fromRoot.State {
  sharedManagement: SharedModuleState;
}

export const reducers: ActionReducerMap<SharedModuleState> = {
  notifications: fromNotifications.reducer,
  authenticationRecord: fromAuthentication.reducer,
  menuItems: fromMenuItems.reducer,
  notificationValidator: fromNotificationValidator.reducer,
  chatMessenger: fromChatMessenger.reducer
  // tags: fromTags.reducer
};

export const getSharedState = createFeatureSelector<State, SharedModuleState>("sharedManagement");

// Authentication Selectors
export const getAuthenticationState = createSelector(
  getSharedState,
  (state) => state.authenticationRecord
);

export const getTimeShettButtonDetails = createSelector(
  getAuthenticationState,
  (authenticationRecord)  => authenticationRecord.TimeSheetRestrictedData
)

export const isTimeSheetFetching = createSelector(
  getAuthenticationState,
  (authenticationRecord)  => authenticationRecord.isTimeSheetFetching
)

export const getIsStartEnabled = createSelector(
  getAuthenticationState,
  (authenticationRecord) => authenticationRecord.isStartEnabled
);

export const getIfUserIsAuthenticated = createSelector(
  getAuthenticationState,
  (authenticationRecord) => authenticationRecord.userLoggedIn
);

export const getIfUserIsLoggingIn = createSelector(
  getAuthenticationState,
  (authenticationRecord) => authenticationRecord.userLoggingIn
);

export const getAuthenticatedUserRecord = createSelector(
  getAuthenticationState,
  (authenticationRecord) => authenticationRecord
);

export const getAuthenticatedUserModel = createSelector(
  getAuthenticationState,
  (authenticationRecord) => authenticationRecord.userModel
);

export const getErrorWhileUserIsLoggingIn = createSelector(
  getAuthenticationState,
  (authenticationRecord) => authenticationRecord.errorWhileLoggingIn
);

export const getAllRoleFeatures = createSelector(
  getAuthenticationState,
  (authenticationRecord) => authenticationRecord.roleFeatures
);

export const getAllEntityTypeRoleFeatures = createSelector(
  getAuthenticationState,
  (authenticationRecord) => authenticationRecord.entityTypeRoleFeatures
);

export const getAllRoleFeaturesByUserId = createSelector(
  getAuthenticationState,
  (authenticationRecord) => authenticationRecord.rolePermissionsList
);

export const getDemoRecordsDataDeletion = createSelector(
  getAuthenticationState,
  (authenticationRecord) => authenticationRecord.deletingDemoData
);


export const getThemeModel = createSelector(
  getAuthenticationState,
  authenticationRecord => authenticationRecord.themeModel
);


export const getCompanySettings = createSelector(
  getAuthenticationState,
  authenticationRecord => authenticationRecord.companySettingsModel
);

export const getEntityRolePermissionsByProjectId = createSelector(
  getAuthenticationState,
  (authenticationRecord, props) => {
    return (
      // tslint:disable-next-line: only-arrow-functions
      authenticationRecord.rolePermissionsList.filter(function (
        roleFeatureModel: EntityRoleFeatureModel
      ) {
        return (
          roleFeatureModel.projectId.toString().toLowerCase() ===
          props.projectId.toString().toLowerCase()
        );
      })
    );
  }
);

export const getUserStoreId = createSelector(
  getAuthenticationState,
  authenticationRecord => authenticationRecord.userStoreId
);

// Role Feature Selectors
export const doesUserHavePermission = createSelector(
  getAuthenticationState,
  (authenticationRecord, props) => {
    return (
      // tslint:disable-next-line: only-arrow-functions
      authenticationRecord.roleFeatures.filter(function (
        roleFeatureModel: any
      ) {
        return (
          roleFeatureModel.featureId.toString().toLowerCase() ===
          props.featureId.toString().toLowerCase()
        );
      }).length > 0
    );
  }
);

export const getRoleFeaturesLoading = createSelector(
  getAuthenticationState,
  (authenticationRecord) => authenticationRecord.loadingRoleFeatures
);

// Entity Role Feature Selectors
export const doesUserHavePermissionForEntityTypeFeature = createSelector(
  getAuthenticationState,
  (authenticationRecord, props) => {
    return (
      // tslint:disable-next-line: only-arrow-functions
      authenticationRecord.entityTypeRoleFeatures.filter(function (
        roleFeatureModel: EntityRoleFeatureModel
      ) {
        return (
          roleFeatureModel.entityFeatureId.toString().toLowerCase() ===
          props.entityFeatureId.toString().toLowerCase()
        );
      }).length > 0
    );
  }
);

export const getEntityFeaturesLoading = createSelector(
  getAuthenticationState,
  (authenticationRecord) => authenticationRecord.loadingEntityFeatures
);


export const getUserEntityFeaturesLoading = createSelector(
  getAuthenticationState,
  (authenticationRecord) => authenticationRecord.loadingUserEntityFeatures
);

// Menu Items Selectors
export const getMenuItemsState = createSelector(
  getSharedState,
  (state) => state.menuItems
);

export const {
  selectIds: getMenuItemsIds,
  selectEntities: getMenuItemsEntities,
  selectAll: getMenuItemsAll,
  selectTotal: getMenuItemsTotal
} = fromMenuItems.menuItemsAdapter.getSelectors(getMenuItemsState);

export const getMenuItemsLoading = createSelector(
  getMenuItemsState,
  (state) => state.menuItemsLoading
);

export const getMenuCategory = createSelector(
  getMenuItemsState,
  (state) => state.menuCategory
);

export const getCurrentActiveMenuCategoryMenuItems = createSelector(
  getMenuItemsAll,
  getMenuCategory,
  (menuItems, menuCategory) =>
    // tslint:disable-next-line: only-arrow-functions
    menuItems.filter(function (x) {
      return (
        x.menuCategory &&
        menuCategory &&
        x.menuCategory.toLowerCase() === menuCategory.toLowerCase()
      );
    })
);

// Notifications Selectors
export const getNotificationsState = createSelector(
  getSharedState,
  (state) => state.notifications
);

export const {
  selectIds: getNotificationIds,
  selectEntities: getNotificationEntities,
  selectAll: getNotificationAll,
  selectTotal: getNotificationTotal
} = fromNotifications.notificationsAdapter.getSelectors(getNotificationsState);

export const getNotificationUnreadTotal = createSelector(
  getNotificationAll,
  (entities) => entities.filter((notification) => !notification.isRead).length
);

export const getNotificationsLoading = createSelector(
  getSharedState,
  (state) => state.notifications.loadingNotifications
);

export const getChatMessengerState = createSelector(
  getSharedState,
  (state) => state.chatMessenger
);