import * as fromProjects from './testrailprojects.effects';
import * as fromTestSuites from './testsuiteslist.effects';
import * as fromTestSuiteSection from './testsuitesection.effects';
import * as fromTestCaseTypes from './testcasetypes.effects';
import * as fromTestCasePriorities from './testcasepriorities.effects';
import * as fromTestCaseTemplates from './testcasetemplates.effects';
import * as fromTestCaseAutomations from './testcaseautomationtypes.effects';
import * as fromTestCaseSections from './testcasesections.effetcs';
import * as fromTestCase from './testcaseadd.effects';
import * as fromMileStone from './milestones.effects';
import * as fromMileStoneDropdown from './milestonedropdown.effects';
import * as fromTestRun from './testrun.effects';
import * as fromTestRunUsers from './testrunusers.effetcs';
import * as fromTestCaseStatuses from './testcasestatuses.effects';
import * as fromReports from './reports.effects';
import * as fromSnackbarEffects from './snackbar.effects';
import * as fromNotificationValidatorEffects from './notification-validator.effects';

export const allTestRailModuleEffects: any = [
  fromProjects.ProjectEffects,
  fromTestSuites.TestSuiteEffects,
  fromTestSuiteSection.TestSuiteEffects,
  fromTestCaseSections.TestCaseSectionEffects,
  fromTestCaseTypes.TestCaseTypeEffects,
  fromTestCasePriorities.TestCasePriorityEffects,
  fromTestCaseTemplates.TestCaseTemplateEffects,
  fromTestCaseAutomations.TestCaseAutomationEffects,
  fromTestCase.TestCaseEffects,
  fromMileStone.MileStoneEffects,
  fromMileStoneDropdown.MileStoneDropdownEffects,
  fromTestRun.TestRunEffects,
  fromTestRunUsers.TestRunUserEffects,
  fromTestCaseStatuses.TestCaseStatusEffects,
  fromReports.ReportEffects,
  fromSnackbarEffects.SnackbarEffects,
  fromNotificationValidatorEffects.NotificationValidatorEffects
];