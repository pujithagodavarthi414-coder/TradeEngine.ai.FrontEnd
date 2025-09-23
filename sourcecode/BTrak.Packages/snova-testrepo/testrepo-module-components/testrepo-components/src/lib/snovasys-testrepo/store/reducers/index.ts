import { createSelector, createFeatureSelector, ActionReducerMap, MemoizedSelector } from '@ngrx/store';
import { MemoizedSelectorWithProps } from '@ngrx/store/src/selector';
import { Dictionary } from '@ngrx/entity';

import * as fromProjects from './testrailprojects.reducers';
import * as fromTestSuites from './testsuiteslist.reducers';
import * as fromTestSuiteSection from './testsuitesection.reducers';
import * as fromTestCaseSections from './testcasesections.reducers';
import * as fromTestCaseTypes from './testcasetypes.reducers';
import * as fromTestCasePriorities from './testcasepriorities.reducers';
import * as fromTestCaseTemplates from './testcasetemplates.reducers';
import * as fromTestCaseAutomations from './testcaseautomationtypes.reducers';
import * as fromTestCases from './testcaseadd.reducers';
import * as fromMileStones from './milestones.reducers';
import * as fromMileStoneDropdown from './milestonedropdown.reducers';
import * as fromTestRun from './testrun.reducers';
import * as fromTestRunUsers from './testrunusers.reducers';
import * as fromTestCaseStatuses from './testcasestatuses.reducers';
import * as fromReports from './reports.reducers';
import * as fromTestCasesAfterStatus from './testcasesruns.reducers';
import * as fromNotificationValidator from "./notification-validator.reducers";
import * as fromSnackbar from "./snackbar.reducers";

import * as _ from 'underscore';

import { MileStone, MileStonesList, MileStoneWithCount } from '../../models/milestone';
import { ProjectList } from '../../models/projectlist';
import { TestRailReport, ReportsList, TestRailReportsMiniModel, ShareReport } from '../../models/reports-list';
import { TestCase, TestCaseStepsModel, TestCaseStepStatusModel, TestCaseHistoryModel, TestCaseTitle, MultipleTestCases } from '../../models/testcase';
import { TestCaseDropdownList } from '../../models/testcasedropdown';
import { TestCaseRunDetails } from '../../models/testcaserundetails';
import { TestCasesShift, MoveTestCasesModel } from '../../models/testcaseshift';
import { TestRunList, TestRun } from '../../models/testrun';
import { TestSuite, TestSuiteList, TestSuiteMultipleUpdates, TestSuiteExportModel } from '../../models/testsuite';
import { TestSuiteSection, TestSuiteSectionList, TestSuiteCases, TestSuiteSections, TestCasesModel, TestSuiteRunSections } from '../../models/testsuitesection';

import * as fromRoot from '../../../../store/reducers/index';

export interface TestRailManagementState {
  projects: fromProjects.State;
  testSuites: fromTestSuites.State;
  testSuiteSection: fromTestSuiteSection.State;
  testCaseSections: fromTestCaseSections.State;
  testCaseTypes: fromTestCaseTypes.State;
  testCasePriorities: fromTestCasePriorities.State;
  testCaseTemplates: fromTestCaseTemplates.State;
  testCaseAutomations: fromTestCaseAutomations.State;
  testCases: fromTestCases.State;
  mileStones: fromMileStones.State;
  mileStoneDropdown: fromMileStoneDropdown.State;
  testRuns: fromTestRun.State;
  testRunUsers: fromTestRunUsers.State;
  testCaseStatuses: fromTestCaseStatuses.State;
  reports: fromReports.State;
  testCasesAfterStatus: fromTestCasesAfterStatus.State;
  snackbarState: fromSnackbar.State;
  validationsState: fromNotificationValidator.State;
}

export interface State extends fromRoot.State {
  testRailManagement: TestRailManagementState;
}

export const reducers: ActionReducerMap<TestRailManagementState> = {
  projects: fromProjects.reducer,
  testSuites: fromTestSuites.reducer,
  testSuiteSection: fromTestSuiteSection.reducer,
  testCaseSections: fromTestCaseSections.reducer,
  testCaseTypes: fromTestCaseTypes.reducer,
  testCasePriorities: fromTestCasePriorities.reducer,
  testCaseTemplates: fromTestCaseTemplates.reducer,
  testCaseAutomations: fromTestCaseAutomations.reducer,
  testCases: fromTestCases.reducer,
  mileStones: fromMileStones.reducer,
  mileStoneDropdown: fromMileStoneDropdown.reducer,
  testRuns: fromTestRun.reducer,
  testRunUsers: fromTestRunUsers.reducer,
  testCaseStatuses: fromTestCaseStatuses.reducer,
  reports: fromReports.reducer,
  testCasesAfterStatus: fromTestCasesAfterStatus.reducer,
  snackbarState: fromSnackbar.reducer,
  validationsState: fromNotificationValidator.reducer
}

export const getTestRailManagementState = createFeatureSelector<State, TestRailManagementState>('testRailManagement');

export const getProjectEntitiesState = createSelector(
  getTestRailManagementState,
  state => state.projects
);

export const {
  selectIds: getProjectsIds,
  selectEntities: getProjectsEntities,
  selectAll: getProjectsAll,
  selectTotal: getProjectsTotal
} = fromProjects.testRailAdapter.getSelectors(getProjectEntitiesState);

export const getProjectsDataLoading = createSelector(
  getTestRailManagementState,
  state => state.projects.loadingTestRailProjects
);

export const getProjectRelatedDataLoading = createSelector(
  getTestRailManagementState,
  state => state.projects.loadingProjectRelatedData
);

export const getProjectRelatedData = createSelector(
  getTestRailManagementState,
  state => state.projects.ProjectRelatedData
);

export const getTestSuitesCount = createSelector(
  getTestRailManagementState,
  state => state.projects.testSuiteCount
);

export const getTestRunsCount = createSelector(
  getTestRailManagementState,
  state => state.projects.openTestRunCount
);

export const getMilestonesCount = createSelector(
  getTestRailManagementState,
  state => state.projects.openMilestoneCount
);

export const getReportsCount = createSelector(
  getTestRailManagementState,
  state => state.projects.reportCount
);

export const getProjectName = createSelector(
  getTestRailManagementState,
  state => state.projects.projectName
);

export const getProjectResponsiblePersonName = createSelector(
  getTestRailManagementState,
  state => state.projects.projectResponsiblePersonName
);

export const createTestSuiteLoading = createSelector(
  getTestRailManagementState,
  state => state.testSuites.loadingTestSuite
);

export const getTestSuitesListLoading = createSelector(
  getTestRailManagementState,
  state => state.testSuites.loadingTestSuiteList
);

export const getTestSuites = createSelector(
  getTestRailManagementState,
  state => state.testSuites
);

export const {
  selectIds: getTestSuiteIds,
  selectEntities: getTestSuiteEntities,
  selectAll: getTestSuiteAll,
  selectTotal: getTestSuiteTotal
} = fromTestSuites.testSuiteAdapter.getSelectors(getTestSuites);

export const createTestSuiteSectionLoading = createSelector(
  getTestRailManagementState,
  state => state.testSuiteSection.loadingTestSuiteSection
);

export const getTestSuiteSectionListLoading = createSelector(
  getTestRailManagementState,
  state => state.testSuiteSection.loadingTestSuiteSectionList
);

export const getTestRunSectionListLoading = createSelector(
  getTestRailManagementState,
  state => state.testSuiteSection.loadingTestRunSectionList
);

export const getTestSuiteSectionList = createSelector(
  getTestRailManagementState,
  state => state.testSuiteSection.TestSuiteSectionList
);

export const getTestRunSectionList = createSelector(
  getTestRailManagementState,
  state => state.testSuiteSection.TestRunSectionList
);

export const getTestSuiteSectionListForRunsLoading = createSelector(
  getTestRailManagementState,
  state => state.testSuiteSection.loadingTestSuiteSectionListForRuns
);

export const getTestSuiteSectionListForRuns = createSelector(
  getTestRailManagementState,
  state => state.testSuiteSection.TestSuiteSectionListForRuns
);

export const getTestCaseSectionListForShift = createSelector(
  getTestRailManagementState,
  state => state.testCaseSections.TestCaseSectionListForShift
);

export const getTestCaseSectionList = createSelector(
  getTestRailManagementState,
  state => state.testCaseSections
);

export const {
  selectIds: getTestCaseSectionIds,
  selectEntities: getTestCaseSectionEntities,
  selectAll: getTestCaseSectionAll,
  selectTotal: getTestCaseSectionTotal
} = fromTestCaseSections.testCaseSectionAdapter.getSelectors(getTestCaseSectionList);

export const getTestCaseTypeList = createSelector(
  getTestRailManagementState,
  state => state.testCaseTypes
);

export const {
  selectIds: getTestCaseTypeIds,
  selectEntities: getTestCaseTypeEntities,
  selectAll: getTestCaseTypeAll,
  selectTotal: getTestCaseTypeTotal
} = fromTestCaseTypes.testCaseTypeAdapter.getSelectors(getTestCaseTypeList);

export const getTestCasePriorityList = createSelector(
  getTestRailManagementState,
  state => state.testCasePriorities
);

export const {
  selectIds: getTestCasePriorityIds,
  selectEntities: getTestCasePriorityEntities,
  selectAll: getTestCasePriorityAll,
  selectTotal: getTestCasePriorityTotal
} = fromTestCasePriorities.testCasePriorityAdapter.getSelectors(getTestCasePriorityList);

export const getTestCaseTemplateList = createSelector(
  getTestRailManagementState,
  state => state.testCaseTemplates
);

export const {
  selectIds: getTestCaseTemplateIds,
  selectEntities: getTestCaseTemplateEntities,
  selectAll: getTestCaseTemplateAll,
  selectTotal: getTestCaseTemplateTotal
} = fromTestCaseTemplates.testCaseTemplateAdapter.getSelectors(getTestCaseTemplateList);

export const getTestCaseStatusList = createSelector(
  getTestRailManagementState,
  state => state.testCaseStatuses
);

export const {
  selectIds: getTestCaseStatusIds,
  selectEntities: getTestCaseStatusEntities,
  selectAll: getTestCaseStatusAll,
  selectTotal: getTestCaseStatusTotal
} = fromTestCaseStatuses.testCaseStatusAdapter.getSelectors(getTestCaseStatusList);

export const getTestCaseAutomationList = createSelector(
  getTestRailManagementState,
  state => state.testCaseAutomations
);

export const getTestCaseAutomateTypesLoading = createSelector(
  getTestRailManagementState,
  state => state.testCaseAutomations.loadingTestCaseAutomations
);

export const {
  selectIds: getTestCaseAutomationIds,
  selectEntities: getTestCaseAutomationEntities,
  selectAll: getTestCaseAutomationAll,
  selectTotal: getTestCaseAutomationTotal
} = fromTestCaseAutomations.testCaseAutomationAdapter.getSelectors(getTestCaseAutomationList);

export const getTestCaseTemplatesLoading = createSelector(
  getTestRailManagementState,
  state => state.testCaseTemplates.loadingTestCaseTemplates
);

export const getTestCaseDetailsById = createSelector(
  getTestRailManagementState,
  state => state.testCases.TestCaseDetails
);

export const getTestCasesBySectionId = createSelector(
  getTestRailManagementState,
  state => state.testCases
);

export const getSingleTestCaseDetailsLoading = createSelector(
  getTestRailManagementState,
  state => state.testCases.loadingSingleTestCaseDetailsByCaseId
);

export const getSingleTestCaseDetailsByCaseId = createSelector(
  getTestRailManagementState,
  state => state.testCases.SingleTestCaseDetailsByCaseId
);

export const getSingleTestRunCaseDetailsLoading = createSelector(
  getTestRailManagementState,
  state => state.testCases.loadingSingleTestRunCaseDetailsByCaseId
);

export const getSingleTestRunCaseDetailsByCaseId = createSelector(
  getTestRailManagementState,
  state => state.testCases.SingleTestRunCaseDetailsByCaseId
);

export const {
  selectIds: getTestCasesBySectionIds,
  selectEntities: getTestCasesBySectionEntities,
  selectAll: getTestCasesBySectionAll,
  selectTotal: getTestCasesBySectionTotal
} = fromTestCases.testCaseAdapter.getSelectors(getTestCasesBySectionId);

export const getTestCaseEditDetailsByTestCaseId = createSelector(
  getTestRailManagementState,
  (state, props) => {
    var filteredTestCases = _.filter(state.testCases.entities, function (testCase: TestCase) {
      return testCase.testCaseId == props.testCaseId
    });
    return filteredTestCases;
  }
);

export const getHierarchicalTestCasesFilterBySectionId = createSelector(
  getTestRailManagementState,
  (state, props) => {
    var filteredTestCases = _.filter(state.testCases.entities, function (testCase: TestCase) {
      return testCase.sectionId == props.sectionId
    });
    return filteredTestCases;
  }
);

export const getTestCasesByUserStoryId = createSelector(
  getTestRailManagementState,
  state => state.testCases
);

export const {
  selectIds: getTestCasesByUserStoryIds,
  selectEntities: getTestCasesByUserStoryIdEntities,
  selectAll: getTestCasesByUserStoryIdAll,
  selectTotal: getTestCasesByUserStoryIdTotal
} = fromTestCases.testCaseAdapter.getSelectors(getTestCasesByUserStoryId);

export const getTestCasesBySectionIdForRuns = createSelector(
  getTestRailManagementState,
  state => state.testCases.TestCasesBySectionIdForRuns
);

export const getTestCasesByFiltersForRunsLoading = createSelector(
  getTestRailManagementState,
  state => state.testCases.loadingTestCasesByFilterForRuns
);

export const getBugsByGoalId = createSelector(
  getTestRailManagementState,
  state => state.testCases.BugsByGoalId
);

export const getBugsByGoalIdLoading = createSelector(
  getTestRailManagementState,
  state => state.testCases.loadingBugsByGoalId
);

export const getBugsByUserStoryId = createSelector(
  getTestRailManagementState,
  state => state.testCases.BugsByUserStoryId
);

export const getBugsByTestCaseScenarioId = createSelector(
  getTestRailManagementState,
  state => state.testCases.BugsByTestCaseId
);

export const getBugsByUserStoryIdLoading = createSelector(
  getTestRailManagementState,
  state => state.testCases.loadingBugsByUserStoryId
);

export const getBugsByTestCaseScenarioIdLoading = createSelector(
  getTestRailManagementState,
  state => state.testCases.loadingBugsByTestCaseId
);

export const getHistoryByUserStoryId = createSelector(
  getTestRailManagementState,
  state => state.testCases.HistoryDetailsByUserStoryId
);

export const getHistoryByUserStoryIdLoading = createSelector(
  getTestRailManagementState,
  state => state.testCases.loadingHistoryByUserStoryId
);

export const getTestCasesByFiltersForRuns = createSelector(
  getTestRailManagementState,
  state => state.testCases.FilteredTestCasesForRuns
);

export const getTestCasesByFiltersForSuites = createSelector(
  getTestRailManagementState,
  state => state.testCases.FilteredTestCasesForSuites
);

export const getTestCaseTitleLoading = createSelector(
  getTestRailManagementState,
  state => state.testCases.loadingTestCaseTitle
);

export const getTestCaseDetailsLoading = createSelector(
  getTestRailManagementState,
  state => state.testCases.loadingTestCaseDetails
);

export const getReorderTestCasesLoading = createSelector(
  getTestRailManagementState,
  state => state.testCases.loadingReorderTestCases
);

export const getMoveTestCasesLoading = createSelector(
  getTestRailManagementState,
  state => state.testCases.loadingMoveTestCases
);

export const getTestCasesBySectionIdLoading = createSelector(
  getTestRailManagementState,
  state => state.testCases.loadingTestCaseDetailsBySectionId
);

export const getTestCasesByUserStoryIdLoading = createSelector(
  getTestRailManagementState,
  state => state.testCases.loadingTestCaseScenariosByUserStoryId
);

export const getTestCasesBySectionIdForRunsLoading = createSelector(
  getTestRailManagementState,
  state => state.testCases.loadingTestCaseDetailsBySectionIdForRuns
);

export const getMileStoneLoading = createSelector(
  getTestRailManagementState,
  state => state.mileStones.loadingMileStone
);

export const getMileStoneList = createSelector(
  getTestRailManagementState,
  state => state.mileStones
);

export const {
  selectIds: getMileStoneIds,
  selectEntities: getMileStoneEntities,
  selectAll: getMileStoneAll,
  selectTotal: getMileStoneTotal
} = fromMileStones.mileStoneAdapter.getSelectors(getMileStoneList);

export const getMileStoneListLoading = createSelector(
  getTestRailManagementState,
  state => state.mileStones.loadingMileStoneDetails
);

export const getMileStoneDropdownList = createSelector(
  getTestRailManagementState,
  state => state.mileStoneDropdown.MileStoneDropdownList
);

export const getTestRunLoading = createSelector(
  getTestRailManagementState,
  state => state.testRuns.loadingTestRun
);

export const getTestRunListLoading = createSelector(
  getTestRailManagementState,
  state => state.testRuns.loadingTestRunsList
);

export const getTestRunsList = createSelector(
  getTestRailManagementState,
  state => state.testRuns
);

export const {
  selectIds: getTestRunIds,
  selectEntities: getTestRunEntities,
  selectAll: getTestRunAll,
  selectTotal: getTestRunTotal
} = fromTestRun.testRunAdapter.getSelectors(getTestRunsList);

export const getTestRunUsersList = createSelector(
  getTestRailManagementState,
  state => state.testRunUsers
);

export const {
  selectIds: getTestRunUserIds,
  selectEntities: getTestRunUserEntities,
  selectAll: getTestRunUserAll,
  selectTotal: getTestRunUserTotal
} = fromTestRunUsers.testRunUserdapter.getSelectors(getTestRunUsersList);

export const getTestRunsByMileStone = createSelector(
  getTestRailManagementState,
  state => state.mileStones.TestRunList
);

export const createReportLoading = createSelector(
  getTestRailManagementState,
  state => state.reports.loadingReport
);

export const getReportsListLoading = createSelector(
  getTestRailManagementState,
  state => state.reports.loadingReportList
);

export const getReports = createSelector(
  getTestRailManagementState,
  state => state.reports
);

export const {
  selectIds: getReportIds,
  selectEntities: getReportEntities,
  selectAll: getReportAll,
  selectTotal: getReportTotal
} = fromReports.reportAdapter.getSelectors(getReports);

export const getDetailedReportLoading = createSelector(
  getTestRailManagementState,
  state => state.reports.loadingDetailedReport
);

export const getDetailedReport = createSelector(
  getTestRailManagementState,
  state => state.reports.DetailedReport
);

export const getSharedReportLoading = createSelector(
  getTestRailManagementState,
  state => state.reports.loadingShareReport
);

export const getTestCasesInRunsAfterStatus = createSelector(
  getTestRailManagementState,
  state => state.testCasesAfterStatus
);

export const {
  selectIds: getTestCasesInRunsAfterStatusds,
  selectEntities: getTestCasesInRunsAfterStatusEntities,
  selectAll: getTestCasesInRunsAfterStatusAll,
  selectTotal: getTestCasesInRunsAfterStatusTotal
} = fromTestCasesAfterStatus.testCasesForRunsAdapter.getSelectors(getTestCasesInRunsAfterStatus);

export const getTestRunStatusCasesByTestCaseId = createSelector(
  getTestRailManagementState,
  (state, props) => {
    var filteredRunTestCases = _.filter(state.testCasesAfterStatus.entities, function (testCase: TestCase) {
      return testCase.testCaseId == props.testCaseId
    });
    return filteredRunTestCases;
  }
);

export const getHierarchicalTestRunCasesFilterBySectionId = createSelector(
  getTestRailManagementState,
  (state, props) => {
    var filteredRunTestCases = _.filter(state.testCasesAfterStatus.entities, function (testCase: TestCase) {
      return testCase.sectionId == props.sectionId
    });
    return filteredRunTestCases;
  }
);

export const getTestCasesBySectionAndRunIdForRunsLoading = createSelector(
  getTestRailManagementState,
  state => state.testCasesAfterStatus.loadingTestCaseDetailsBySectionAndRunIdForRuns
);

export const getSingleTestCaseBySectionAndRunIdForRunsLoading = createSelector(
  getTestRailManagementState,
  state => state.testCasesAfterStatus.loadingSingleTestCaseDetails
);