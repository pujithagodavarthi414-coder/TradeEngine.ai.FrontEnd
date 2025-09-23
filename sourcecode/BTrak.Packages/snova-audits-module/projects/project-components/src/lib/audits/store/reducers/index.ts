import { createSelector, createFeatureSelector, ActionReducerMap, MemoizedSelector } from '@ngrx/store';
import * as _ from 'underscore';

import * as fromAudits from './audits.reducers';
import * as fromAuditCategories from './audit-categories.reducers';
import * as fromAuditConducts from './conducts.reducers';
import * as fromQuestions from './questions.reducers';
import * as fromAuditReports from './audit-report.reducers';
import * as fromBugPriorities from "../../dependencies/project-store/reducers/bug-priority.reducers";

import * as fromRoot from '../../dependencies/main-store/reducers/index';
import { QuestionModel } from '../../models/question.model';
import * as fromsoftLabels from "../../dependencies/common-store/reducers/soft-labels.reducers";
import { MemoizedSelectorWithProps } from '@ngrx/store/src/selector';
// import { EntityRoleFeatureModel } from '../../dependencies/models/entityRoleFeature';
// import * as fromAuthentication from "../../dependencies/shared-store/reducers/authentication.reducers";

export interface AuditManagementState {
    audits: fromAudits.State;
    auditCategories: fromAuditCategories.State;
    auditConducts: fromAuditConducts.State;
    questions: fromQuestions.State;
    auditReports: fromAuditReports.State;
    softLabels: fromsoftLabels.State;
    bugPriorities: fromBugPriorities.State;
    // authenticationRecord: fromAuthentication.State;
}

export interface State extends fromRoot.State {
    auditManagement: AuditManagementState;
}

export const reducers: ActionReducerMap<AuditManagementState> = {
    audits: fromAudits.reducer,
    auditCategories: fromAuditCategories.reducer,
    auditConducts: fromAuditConducts.reducer,
    questions: fromQuestions.reducer,
    auditReports: fromAuditReports.reducer,
    softLabels: fromsoftLabels.reducer,
    bugPriorities: fromBugPriorities.reducer,
    // authenticationRecord: fromAuthentication.reducer
}

export const getAuditManagementState: MemoizedSelector<State, AuditManagementState> = createFeatureSelector<State, AuditManagementState>('auditManagement');

export const getActiveAuditsCount: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.audits.activeAuditsCount
);

export const getArchivedAuditsCount: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.audits.archivedAuditsCount
);

export const getActiveAuditConductsCount: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.audits.activeAuditConductsCount
);

export const getArchivedAuditConductsCount: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.audits.archivedAuditConductsCount
);

export const getActiveAuditFoldersCount: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.audits.activeAuditFoldersCount
);

export const getArchivedAuditFoldersCount: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.audits.archivedAuditFoldersCount
);

export const getActiveAuditReportsCount: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.audits.activeAuditReportsCount
);

export const getArchivedAuditReportsCount: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.audits.archivedAuditReportsCount
);

export const getActionsCount: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.audits.actionsCount
);

export const getUpsertAuditLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.audits.loadingAudit
);

export const getAuditCloneLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.audits.loadingAuditClone
);

export const getAuditsListLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.audits.loadingAuditList
);

export const getAuditVersionsListLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.audits.loadingAuditVersionList
);

export const getAuditVersionsList: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.audits.auditVersions
);

export const getAuditCopyListLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.audits.loadingAuditCopyList
);

export const getAuditCopyList: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.audits.auditCopyList
);

export const getAuditTagListLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.audits.loadingAuditTagList
);

export const getAuditTagList: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.audits.auditTagList
);

export const getUpsertAuditTagLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.audits.loadingAuditTag
);

export const getConductTagListLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.audits.loadingConductTagList
);

export const getConductTagList: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.audits.conductTagList
);

export const getUpsertConductTagLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.audits.loadingConductTag
);

export const getAudits: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.audits
);

export const {
    selectIds: getAuditIds,
    selectEntities: getAuditEntities,
    selectAll: getAuditAll,
    selectTotal: getAuditTotal
} : any = fromAudits.auditAdapter.getSelectors(getAudits);

export const getUpsertAuditCategoryLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.auditCategories.loadingAuditCategory
);

export const getAuditCategoryListLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.auditCategories.loadingAuditCategoryList
);

export const getAuditCategoryList: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.auditCategories.auditCategoryList
);

export const getAuditVersionCategoryListLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.auditCategories.loadingAuditVersionCategoryList
);

export const getAuditVersionCategoryList: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.auditCategories.auditVersionCategoryList
);

export const getCategoriesListLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.auditCategories.loadingCategoryList
);

export const getVersionCategoriesListLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.auditCategories.loadingVersionCategoryList
);

export const getCategoriesList: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.auditCategories.categoryList
);

export const getVersionCategoriesList: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.auditCategories.versionCategoryList
);

export const getCategoriesForConductsLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.auditCategories.loadingAuditCategoriesForConducts
);

export const getCategoriesForConductsEditLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.auditCategories.loadingAuditCategoriesForConductsEdit
);

export const getCategoriesListForConducts: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.auditCategories.auditCategoriesForConducts
);

export const getCategoriesListForConductsEdit: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.auditCategories.auditCategoriesForConductsEdit
);

export const getUpsertAuditConductLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.auditConducts.loadingAuditConduct
);

export const getAuditConductsListLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.auditConducts.loadingAuditConductList
);

export const getSubmitConductLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.auditConducts.loadingSubmitConduct
);

export const getAuditConducts: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.auditConducts
);

export const {
    selectIds: getAuditConductIds,
    selectEntities: getAuditConductEntities,
    selectAll: getAuditConductAll,
    selectTotal: getAuditConductTotal
} : any = fromAuditConducts.auditConductAdapter.getSelectors(getAuditConducts);

export const getUpsertQuestionLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.questions.loadingQuestion
);

export const getSingleQuestionLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.questions.loadingSingleQuestion
);

export const getSingleVersionQuestionLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.questions.loadingSingleVersionQuestion
);

export const getQuestionListLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.questions.loadingQuestionList
);

export const getVersionQuestionListLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.questions.loadingVersionQuestionList
);

export const getVersionQuestionList: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.questions.auditVersionQuestions
);

export const getQuestions: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.questions
);

export const {
    selectIds: getQuestionIds,
    selectEntities: getQuestionEntities,
    selectAll: getQuestionAll,
    selectTotal: getQuestionTotal
} : any = fromQuestions.questionAdapter.getSelectors(getQuestions);

export const getHierarchicalQuestionsFilterByCategoryId: MemoizedSelectorWithProps<State, any, any> = createSelector(
    getAuditManagementState,
    (state, props) => {
        var filteredQuestions = _.filter(state.questions.entities, function (question: QuestionModel) {
            return question.auditCategoryId == props.auditCategoryId
        });
        return filteredQuestions;
    }
);

export const getHierarchicalVersionQuestionsFilterByCategoryId: MemoizedSelectorWithProps<State, any, any> = createSelector(
    getAuditManagementState,
    (state, props) => {
        var filteredQuestions = _.filter(state.questions.auditVersionQuestions, function (question: QuestionModel) {
            return question.auditCategoryId == props.auditCategoryId
        });
        return filteredQuestions;
    }
);

export const getQuestionHistoryLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.questions.loadingQuestionHistory
);

export const getQuestionHistory: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.questions.auditQuestionHistory
);

export const getQuestionsReorderLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.questions.loadingQuestionReorder
);

export const getQuestionsByFilterForConductsLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.questions.loadingQuestionsByFilter
);

export const getQuestionsMoveLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.questions.loadingMoveQuestions
);

export const getQuestionsByCategoryIdForConductsLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.questions.loadingQuestionsByCategoryIdForConducts
);

export const getQuestionsByCategoryIdForConducts: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.questions.questionsByCategoryIdForConducts
);

export const getQuestionsForConductsLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.questions.loadingQuestionsForConduct
);

export const getQuestionsForConducts: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.questions
);

export const {
    selectIds: getQuestionConductIds,
    selectEntities: getQuestionConductEntities,
    selectAll: getQuestionConductAll,
    selectTotal: getQuestionConductTotal
} : any = fromQuestions.questionAdapter.getSelectors(getQuestionsForConducts);

export const getHierarchicalQuestionsForConductsByCategoryId: MemoizedSelectorWithProps<State, any, any> = createSelector(
    getAuditManagementState,
    (state, props) => {
        var filteredQuestions = _.filter(state.questions.entities, function (question: QuestionModel) {
            return question.auditCategoryId == props.auditCategoryId
        });
        return filteredQuestions;
    }
);

export const getQuestionForConductLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.questions.loadingConductQuestion
);

export const getInlineQuestionForConductLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.questions.loadingInlineConductQuestion
);

export const getQuestionByIdForConductLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.questions.loadingConductQuestionSearch
);

export const getActionsByQuestionIdLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.questions.loadingQuestionActions
);

export const getActionListByQuestionId: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.questions.actionsByQuestion
);

export const createReportLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.auditReports.loadingReport
);

export const getReportsListLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.auditReports.loadingReportList
);

export const getReports: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.auditReports
);

export const {
    selectIds: getReportIds,
    selectEntities: getReportEntities,
    selectAll: getReportAll,
    selectTotal: getReportTotal
} : any = fromAuditReports.auditReportAdapter.getSelectors(getReports);

export const getDetailedReportLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.auditReports.loadingDetailedReport
);

export const getDetailedReport: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.auditReports.detailedReport
);

export const getSoftLabelsEntitiesState: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.softLabels
  );
  
  
  export const {
    selectIds: getSoftLabelsIds,
    selectEntities: getSoftLabelsEntities,
    selectAll: getSoftLabelsAll,
    selectTotal: getSoftLabelsTotal
  } : any = fromsoftLabels.softLabelAdapter.getSelectors(
    getSoftLabelsEntitiesState
  );
  
  export const createSoftLabelsLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.softLabels.upsertsoftLabel
  );
  
  export const loadingSearchSoftLabels: MemoizedSelector<State, boolean> = createSelector(
    getAuditManagementState,
    state => state.softLabels.loadingsoftLabels
  );
  
// Entity Role Feature Selectors
//   export const doesUserHavePermissionForEntityTypeFeature: MemoizedSelectorWithProps<State, any, boolean> = createSelector(
//     getAuditManagementState,
//     (authenticationRecord, props) => {
//       return (
//         // tslint:disable-next-line: only-arrow-functions
//         authenticationRecord.entityTypeRoleFeatures.filter (function(
//           roleFeatureModel: EntityRoleFeatureModel
//         ) {
//           return (
//             roleFeatureModel.entityFeatureId.toString().toLowerCase() ===
//             props.entityFeatureId.toString().toLowerCase()
//           );
//         }).length > 0
//       );
//     }
//   );
  
//   export const getEntityFeaturesLoading: MemoizedSelector<State, any> = createSelector(
//     getAuditManagementState,
//     (authenticationRecord) => authenticationRecord.loadingEntityFeatures
//   );
  
  
//   export const getUserEntityFeaturesLoading: MemoizedSelector<State, any> = createSelector(
//     getAuditManagementState,
//     (authenticationRecord) => authenticationRecord.loadingUserEntityFeatures
//   );

// BugPriority Selectors
export const getBugPrioritiesEntitiesState: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.bugPriorities
);

export const {
    selectIds: getbugPriorityIds,
    selectEntities: getBugPriorityEntities,
    selectAll: getBugPriorityAll,
    selectTotal: getBugPriorityTotal
} : any = fromBugPriorities.bugPriorityAdapter.getSelectors(
    getBugPrioritiesEntitiesState
);

export const getBugPrioritiesLoading: MemoizedSelector<State, any> = createSelector(
    getAuditManagementState,
    state => state.bugPriorities.loadingBugPriority
);