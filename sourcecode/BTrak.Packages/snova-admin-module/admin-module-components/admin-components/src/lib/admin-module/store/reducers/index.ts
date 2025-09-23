import {
    ActionReducerMap,
    createFeatureSelector,
    createSelector,
    MemoizedSelector
  } from "@ngrx/store";
  
  import * as _ from "underscore";
  // import { EntityRoleFeatureModel } from "../../../shared/models/entityRoleFeature";
  // import { RoleFeatureModel } from "../../../shared/models/rolefeature";
  import * as fromRoot from "../../rootStore/reducers";
  // import * as fromFeedBacks from "../reducers/feedback.reducers";
  import * as fromAuthentication from "./authentication.reducers";
import { MemoizedSelectorWithProps } from '@ngrx/store/src/selector';
  // import * as fromMenuItems from "./menuitems.reducers";
  // import * as fromNotifications from "./notifications.reducers";
  // import * as fromTags from "./tags.reducers";
  
  // tslint:disable-next-line: interface-name
  export interface SharedModuleState {
    // notifications: fromNotifications.State;
    authenticationRecord: fromAuthentication.State;
    // menuItems: fromMenuItems.State;
    // feedBacks: fromFeedBacks.State;
    // tags: fromTags.State;
  }
  
  // tslint:disable-next-line: interface-name
  export interface State extends fromRoot.State {
    shared: SharedModuleState;
  }
  
  export const reducers: ActionReducerMap<SharedModuleState> = {
    // notifications: fromNotifications.reducer,
    authenticationRecord: fromAuthentication.reducer,
    // menuItems: fromMenuItems.reducer,
    // feedBacks: fromFeedBacks.reducer,
    // tags: fromTags.reducer
  };
  
  export const getSharedState: MemoizedSelector<State, SharedModuleState> = createFeatureSelector<State, SharedModuleState>(
    "shared"
  );
  
  // Notifications Selectors
  // export const getNotificationsState = createSelector(
  //   getSharedState,
  //   (state) => state.notifications
  // );
  
  // export const {
  //   selectIds: getNotificationIds,
  //   selectEntities: getNotificationEntities,
  //   selectAll: getNotificationAll,
  //   selectTotal: getNotificationTotal
  // } = fromNotifications.notificationsAdapter.getSelectors(getNotificationsState);
  
  // export const getNotificationUnreadTotal = createSelector(
  //   getNotificationAll,
  //   (entities) => entities.filter((notification) => !notification.isRead).length
  // );
  
  // export const getNotificationsLoading = createSelector(
  //   getSharedState,
  //   (state) => state.notifications.loadingNotifications
  // );
  
  // Authentication Selectors
  export const getAuthenticationState: MemoizedSelector<State, fromAuthentication.State> = createSelector(
    getSharedState,
    (state) => state.authenticationRecord
  );
  
  // export const getIsStartEnabled = createSelector(
  //   getAuthenticationState,
  //   (authenticationRecord)  => authenticationRecord.isStartEnabled
  // );
  
  // export const getIfUserIsAuthenticated = createSelector(
  //   getAuthenticationState,
  //   (authenticationRecord)  => authenticationRecord.userLoggedIn
  // );
  
  // export const getIfUserIsLoggingIn = createSelector(
  //   getAuthenticationState,
  //   (authenticationRecord)  => authenticationRecord.userLoggingIn
  // );
  
  // export const getAuthenticatedUserRecord = createSelector(
  //   getAuthenticationState,
  //   (authenticationRecord)  => authenticationRecord
  // );
  
  // export const getAuthenticatedUserModel = createSelector(
  //   getAuthenticationState,
  //   (authenticationRecord)  => authenticationRecord.userModel
  // );
  
  // export const getErrorWhileUserIsLoggingIn = createSelector(
  //   getAuthenticationState,
  //   (authenticationRecord)  => authenticationRecord.errorWhileLoggingIn
  // );
  
  // export const getAllRoleFeatures = createSelector(
  //   getAuthenticationState,
  //   (authenticationRecord)  => authenticationRecord.roleFeatures
  // );
  
  // export const getAllEntityTypeRoleFeatures = createSelector(
  //   getAuthenticationState,
  //   (authenticationRecord)  => authenticationRecord.entityTypeRoleFeatures
  // );
  
  // export const getAllRoleFeaturesByUserId = createSelector(
  //   getAuthenticationState,
  //   (authenticationRecord)  => authenticationRecord.rolePermissionsList
  // );
  
  // export const getDemoRecordsDataDeletion =  createSelector(
  //   getAuthenticationState,
  //   (authenticationRecord) => authenticationRecord.deletingDemoData
  // );
  
  
  // export const getThemeModel =  createSelector(
  //   getAuthenticationState,
  //   authenticationRecord => authenticationRecord.themeModel
  // );
  
  
  // export const getCompanySettings =  createSelector(
  //   getAuthenticationState,
  //   authenticationRecord => authenticationRecord.companySettingsModel
  // );
  
  
  
  // export const getEntityRolePermissionsByProjectId = createSelector(
  //   getAuthenticationState,
  //   (authenticationRecord, props) => {
  //     return (
  //       // tslint:disable-next-line: only-arrow-functions
  //       authenticationRecord.rolePermissionsList.filter(function(
  //         roleFeatureModel: EntityRoleFeatureModel
  //       ) {
  //         return (
  //           roleFeatureModel.projectId.toString().toLowerCase() ===
  //           props.projectId.toString().toLowerCase()
  //         );
  //       })
  //     );
  //   }
  // );
  
  // export const getUserStoreId = createSelector(
  //   getAuthenticationState,
  //   authenticationRecord => authenticationRecord.userStoreId
  // );
  
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
  
  // export const getRoleFeaturesLoading = createSelector(
  //   getAuthenticationState,
  //   (authenticationRecord) => authenticationRecord.loadingRoleFeatures
  // );
  
  // Entity Role Feature Selectors
  // export const doesUserHavePermissionForEntityTypeFeature = createSelector(
  //   getAuthenticationState,
  //   (authenticationRecord, props) => {
  //     return (
  //       // tslint:disable-next-line: only-arrow-functions
  //       authenticationRecord.entityTypeRoleFeatures.filter (function(
  //         roleFeatureModel: EntityRoleFeatureModel
  //       ) {
  //         return (
  //           roleFeatureModel.entityFeatureId.toString().toLowerCase() ===
  //           props.entityFeatureId.toString().toLowerCase()
  //         );
  //       }).length > 0
  //     );
  //   }
  // );
  
  // export const getEntityFeaturesLoading = createSelector(
  //   getAuthenticationState,
  //   (authenticationRecord) => authenticationRecord.loadingEntityFeatures
  // );
  
  
  // export const getUserEntityFeaturesLoading = createSelector(
  //   getAuthenticationState,
  //   (authenticationRecord) => authenticationRecord.loadingUserEntityFeatures
  // );
  
  // Menu Items Selectors
  // export const getMenuItemsState = createSelector(
  //   getSharedState,
  //   (state) => state.menuItems
  // );
  
  // export const {
  //   selectIds: getMenuItemsIds,
  //   selectEntities: getMenuItemsEntities,
  //   selectAll: getMenuItemsAll,
  //   selectTotal: getMenuItemsTotal
  // } = fromMenuItems.menuItemsAdapter.getSelectors(getMenuItemsState);
  
  // export const getMenuItemsLoading = createSelector(
  //   getMenuItemsState,
  //   (state) => state.menuItemsLoading
  // );
  
  // export const getMenuCategory = createSelector(
  //   getMenuItemsState,
  //   (state) => state.menuCategory
  // );
  
  // export const getCurrentActiveMenuCategoryMenuItems = createSelector(
  //   getMenuItemsAll,
  //   getMenuCategory,
  //   (menuItems, menuCategory) =>
  //     // tslint:disable-next-line: only-arrow-functions
  //     menuItems.filter( function(x) {
  //       return (
  //         x.menuCategory &&
  //         menuCategory &&
  //         x.menuCategory.toLowerCase() === menuCategory.toLowerCase()
  //       );
  //     })
  // );
  
  // feedback selectors
  
  // export const getFeedBacks = createSelector(
  //   getSharedState,
  //   (state) => state.feedBacks
  // );
  
  // export const {
  //   selectIds: getFeedbackIds,
  //   selectEntities: getFeedbackEntities,
  //   selectAll: getFeedbackAll,
  //   selectTotal: geFeedbackTotal
  // } = fromFeedBacks.feedBackAdapter.getSelectors(getFeedBacks);
  
  // export const feedBacksLoading = createSelector(
  //   getSharedState,
  //   (state) => state.feedBacks.upsertFeedBack
  // );
  
  // export const getfeedBacksLoading = createSelector(
  //   getSharedState,
  //   (state) => state.feedBacks.loadingFeedbacks
  // );
  
  // export const submitBugfeedBacksLoading = createSelector(
  //   getSharedState,
  //   (state) => state.feedBacks.submitBugFeedback
  // );
  
  // tags selectors
  
  // export const getTags = createSelector(
  //   getSharedState,
  //   (state) => state.tags
  // );
  
  // export const {
  //   selectIds: getTagIds,
  //   selectEntities: getTagEntities,
  //   selectAll: getTagAll,
  //   selectTotal: getTagTotal
  // } = fromTags.tagsAdapter.getSelectors(getTags);
  
  // export const loadingTags = createSelector(
  //   getSharedState,
  //   (state) => state.tags.loadingTags
  // );
  