import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from "@ngrx/store";

import * as _ from "underscore";
import { EntityRoleFeatureModel } from "../../models/entityRoleFeature";
// import { RoleFeatureModel } from "../../../shared/models/rolefeature";
import * as fromRoot from "../../../store/reducers/index";
import * as fromFeedBacks from "./feedback.reducers";
import * as fromAuthentication from "./authentication.reducers";
import * as fromMenuItems from "./menuitems.reducers";
import * as fromNotifications from "./notifications.reducers";
import * as fromTags from "./tags.reducers";
import { IMenuItem } from '../../models/IMenuItem';
import { MemoizedSelectorWithProps } from '@ngrx/store/src/selector';
import 'rxjs/add/operator/filter';

// tslint:disable-next-line: interface-name
export interface SharedModuleState {
  notifications: fromNotifications.State;
  authenticationRecord: fromAuthentication.State;
  menuItems: fromMenuItems.State;
  feedBacks: fromFeedBacks.State;
  tags: fromTags.State;
}

// tslint:disable-next-line: interface-name
export interface State extends fromRoot.State {
  shared: SharedModuleState;
}

export const reducers: ActionReducerMap<SharedModuleState> = {
  notifications: fromNotifications.reducer,
  authenticationRecord: fromAuthentication.reducer,
  menuItems: fromMenuItems.reducer,
  feedBacks: fromFeedBacks.reducer,
  tags: fromTags.reducer
};

export const getSharedState = createFeatureSelector<State, SharedModuleState>(
  "shared"
);

// Notifications Selectors
export const getNotificationsState: MemoizedSelector<State, any> = createSelector(
  getSharedState,
  (state) => state.notifications
);

export const {
  selectIds: getNotificationIds,
  selectEntities: getNotificationEntities,
  selectAll: getNotificationAll,
  selectTotal: getNotificationTotal
} : any = fromNotifications.notificationsAdapter.getSelectors(getNotificationsState);

export const getNotificationUnreadTotal: MemoizedSelector<State, number> = createSelector(
  getNotificationAll,
  // (entities) => entities.filter((notification) => !notification.isRead).length
  (entities) => _.filter(entities, function(notification){ return !notification.isRead }).length
);

export const getNotificationsLoading: MemoizedSelector<State, any> = createSelector(
  getSharedState,
  (state) => state.notifications.loadingNotifications
);

// Authentication Selectors
export const getAuthenticationState: MemoizedSelector<State, any> = createSelector(
  getSharedState,
  (state) => state.authenticationRecord
);

export const getIsStartEnabled: MemoizedSelector<State, any> = createSelector(
  getAuthenticationState,
  (authenticationRecord)  => authenticationRecord.isStartEnabled
);

export const getIfUserIsAuthenticated: MemoizedSelector<State, any> = createSelector(
  getAuthenticationState,
  (authenticationRecord)  => authenticationRecord.userLoggedIn
);

export const getIfUserIsLoggingIn: MemoizedSelector<State, any> = createSelector(
  getAuthenticationState,
  (authenticationRecord)  => authenticationRecord.userLoggingIn
);

export const getAuthenticatedUserRecord: MemoizedSelector<State, any> = createSelector(
  getAuthenticationState,
  (authenticationRecord)  => authenticationRecord
);

export const getAuthenticatedUserModel: MemoizedSelector<State, any> = createSelector(
  getAuthenticationState,
  (authenticationRecord)  => authenticationRecord.userModel
);

export const getErrorWhileUserIsLoggingIn: MemoizedSelector<State, any> = createSelector(
  getAuthenticationState,
  (authenticationRecord)  => authenticationRecord.errorWhileLoggingIn
);

export const getAllRoleFeatures: MemoizedSelector<State, any> = createSelector(
  getAuthenticationState,
  (authenticationRecord)  => authenticationRecord.roleFeatures
);

export const getAllEntityTypeRoleFeatures: MemoizedSelector<State, any> = createSelector(
  getAuthenticationState,
  (authenticationRecord)  => authenticationRecord.entityTypeRoleFeatures
);

export const getAllRoleFeaturesByUserId: MemoizedSelector<State, any> = createSelector(
  getAuthenticationState,
  (authenticationRecord)  => authenticationRecord.rolePermissionsList
);

export const getDemoRecordsDataDeletion: MemoizedSelector<State, any> =  createSelector(
  getAuthenticationState,
  (authenticationRecord) => authenticationRecord.deletingDemoData
);


export const getThemeModel: MemoizedSelector<State, any> =  createSelector(
  getAuthenticationState,
  authenticationRecord => authenticationRecord.themeModel
);


export const getCompanySettings: MemoizedSelector<State, any[]> =  createSelector(
  getAuthenticationState,
  authenticationRecord => authenticationRecord.companySettingsModel
);



export const getEntityRolePermissionsByProjectId: MemoizedSelectorWithProps<State, any, any> = createSelector(
  getAuthenticationState,
  (authenticationRecord, props) => {
    return (
      // tslint:disable-next-line: only-arrow-functions
      authenticationRecord.rolePermissionsList.filter(function(
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

export const getUserStoreId: MemoizedSelector<State, any> = createSelector(
  getAuthenticationState,
  authenticationRecord => authenticationRecord.userStoreId
);

// Role Feature Selectors
export const doesUserHavePermission: MemoizedSelectorWithProps<State, any, boolean> = createSelector(
  getAuthenticationState,
  (authenticationRecord, props) => {
    return (
      // tslint:disable-next-line: only-arrow-functions
      authenticationRecord.roleFeatures.filter(function(
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

export const getRoleFeaturesLoading: MemoizedSelector<State, any> = createSelector(
  getAuthenticationState,
  (authenticationRecord) => authenticationRecord.loadingRoleFeatures
);

// Entity Role Feature Selectors
export const doesUserHavePermissionForEntityTypeFeature: MemoizedSelectorWithProps<State, any, boolean> = createSelector(
  getAuthenticationState,
  (authenticationRecord, props) => {
    return (
      // tslint:disable-next-line: only-arrow-functions
      authenticationRecord.entityTypeRoleFeatures.filter (function(
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

export const getEntityFeaturesLoading: MemoizedSelector<State, any> = createSelector(
  getAuthenticationState,
  (authenticationRecord) => authenticationRecord.loadingEntityFeatures
);


export const getUserEntityFeaturesLoading: MemoizedSelector<State, any> = createSelector(
  getAuthenticationState,
  (authenticationRecord) => authenticationRecord.loadingUserEntityFeatures
);

// Menu Items Selectors
export const getMenuItemsState: MemoizedSelector<State, any> = createSelector(
  getSharedState,
  (state) => state.menuItems
);

export const {
  selectIds: getMenuItemsIds,
  selectEntities: getMenuItemsEntities,
  selectAll: getMenuItemsAll,
  selectTotal: getMenuItemsTotal
} : any = fromMenuItems.menuItemsAdapter.getSelectors(getMenuItemsState);

export const getMenuItemsLoading: MemoizedSelector<State, any> = createSelector(
  getMenuItemsState,
  (state) => state.menuItemsLoading
);

export const getMenuCategory: MemoizedSelector<State, any> = createSelector(
  getMenuItemsState,
  (state) => state.menuCategory
);

export const getCurrentActiveMenuCategoryMenuItems: MemoizedSelector<State, IMenuItem[]> = createSelector(
  getMenuItemsAll,
  getMenuCategory,
  (menuItems, menuCategory) =>
    // tslint:disable-next-line: only-arrow-functions
    // menuItems.filter( function(x) {
    //   return (
    //     x.menuCategory &&
    //     menuCategory &&
    //     x.menuCategory.toLowerCase() === menuCategory.toLowerCase()
    //   );
    // })

    _.filter(menuItems, function(x) {
      return (
        x.menuCategory &&
        menuCategory &&
        x.menuCategory.toLowerCase() === menuCategory.toLowerCase()
      );
    })
);

// feedback selectors

export const getFeedBacks: MemoizedSelector<State, any> = createSelector(
  getSharedState,
  (state) => state.feedBacks
);

export const {
  selectIds: getFeedbackIds,
  selectEntities: getFeedbackEntities,
  selectAll: getFeedbackAll,
  selectTotal: geFeedbackTotal
} : any = fromFeedBacks.feedBackAdapter.getSelectors(getFeedBacks);

export const feedBacksLoading: MemoizedSelector<State, any> = createSelector(
  getSharedState,
  (state) => state.feedBacks.upsertFeedBack
);

export const getfeedBacksLoading: MemoizedSelector<State, any> = createSelector(
  getSharedState,
  (state) => state.feedBacks.loadingFeedbacks
);

export const submitBugfeedBacksLoading: MemoizedSelector<State, any> = createSelector(
  getSharedState,
  (state) => state.feedBacks.submitBugFeedback
);

// tags selectors

export const getTags: MemoizedSelector<State, any> = createSelector(
  getSharedState,
  (state) => state.tags
);

export const {
  selectIds: getTagIds,
  selectEntities: getTagEntities,
  selectAll: getTagAll,
  selectTotal: getTagTotal
} : any = fromTags.tagsAdapter.getSelectors(getTags);

export const loadingTags: MemoizedSelector<State, any> = createSelector(
  getSharedState,
  (state) => state.tags.loadingTags
);
