import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

import { TestSuite, TestSuiteList, TestSuiteExportModel } from '../models/testsuite';
import { TestSuiteSection, TestSuiteRunSections } from '../models/testsuitesection';
import { TestCase, TestCaseTitle } from '../models/testcase';
import { MileStone } from '../models/milestone';
import { TestRun } from '../models/testrun';
import { TestCaseDropdownList } from '../models/testcasedropdown';

import { ApiUrls } from '../constants/api-urls';
import { TestRailReport, ShareReport } from '../models/reports-list';
import { UpdateMultiple } from '../models/updatemultiple';
import { ProjectList } from '../models/projectlist';
import { SplitBarReport } from '../models/workDoneReport';
import { TestCasesShift, MoveTestCasesModel } from '../models/testcaseshift';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { UserStory } from '../models/userStory';
import { map } from 'rxjs/operators';
import { WorkflowStatus } from '../models/workflowStatus';
import { EntityRoleFeatureModel } from '../models/entityRoleFeature';

@Injectable({
  providedIn: 'root'
})

export class TestRailService {

  constructor(private http: HttpClient) { }

  GetProjects(getTestrailProjectsInputModel: ProjectList) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(getTestrailProjectsInputModel);

    return this.http.post(APIEndpoint + ApiUrls.GetProjects, body, httpOptions);
  }

  GetProjectRelatedData(projectId) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    var paramsObj = new HttpParams().set("projectId", projectId);

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsObj
    };

    return this.http.get(APIEndpoint + ApiUrls.GetTestRailOverviewCountsByProjectId, httpOptions);
  }

  UpsertTestSuite(testSuite: TestSuite) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(testSuite);

    return this.http.post(APIEndpoint + ApiUrls.UpsertTestSuite, body, httpOptions);
  }


  
deleteLinkedBugs(templateUserStoryId: string) {
  let paramsobj = new HttpParams().set("userStoryId", templateUserStoryId);
  let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
  let APIEndpoint = environment.apiURL;
  const httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
    params: paramsobj
  };

  return this.http
    .get(`${APIEndpoint + ApiUrls.DeleteLinkedBug}`, httpOptions)
    .pipe(
      map(result => {
        return result;
      })
    );
}


  
  moveTestSuite(testSuite: TestSuite) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(testSuite);

    return this.http.post(APIEndpoint + ApiUrls.UpdateTestSuiteProject, body, httpOptions);
  }

  ImportTestSuite(formData, projectName) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ enctype: "multipart/form-data" })
    };

    return this.http.post(APIEndpoint + ApiUrls.UploadTestSuitesFromXml + '?projectName=' + projectName, formData, httpOptions);
  }

  ImportTestSuiteFromCsv(formData, projectName) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ enctype: "multipart/form-data" })
    };

    return this.http.post(APIEndpoint + ApiUrls.UploadTestCasesFromCsv + '?projectName=' + projectName, formData, httpOptions);
  }


  downloadTestCasesCsvTemplate() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    var url = APIEndpoint + ApiUrls.DownloadTestCasesCsvTemplate;
    return this.http.get(url, { responseType: "arraybuffer" });
  }

  GetTestSuiteList(testSuite: TestSuiteList) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(testSuite);

    return this.http.post(APIEndpoint + ApiUrls.SearchTestSuites, body, httpOptions);
  }

  UpsertTestsuiteSection(testSuiteSection: TestSuiteSection) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(testSuiteSection);

    return this.http.post(APIEndpoint + ApiUrls.UpsertTestSuiteSection, body, httpOptions);
  }

  GetTestSuiteSectionList(testSuiteRunSection: TestSuiteRunSections) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(testSuiteRunSection);

    return this.http.post(APIEndpoint + ApiUrls.GetTestSuiteCasesOverview, body, httpOptions);
  }

  GetTestRepoDataForJson(exportModel: TestSuiteExportModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(exportModel);

    return this.http.post(APIEndpoint + ApiUrls.GetTestRepoDataForJson, body, httpOptions);
  }

  GetTestCaseTypes(dropDownList: TestCaseDropdownList) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(dropDownList);

    return this.http.post(APIEndpoint + ApiUrls.GetAllTestCaseTypes, body, httpOptions);
  }

  GetTestCasePriorities(dropDownList: TestCaseDropdownList) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(dropDownList);

    return this.http.post(APIEndpoint + ApiUrls.GetAllTestCasePriorities, body, httpOptions);
  }

  GetTestCaseTemplates(dropDownList: TestCaseDropdownList) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(dropDownList);

    return this.http.post(APIEndpoint + ApiUrls.GetAllTestCaseTemplates, body, httpOptions);
  }

  GetTestCaseAutomationTypes(dropDownList: TestCaseDropdownList) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(dropDownList);

    return this.http.post(APIEndpoint + ApiUrls.GetAllTestCaseAutomationTypes, body, httpOptions);
  }

  GetTestCaseStatus(dropDownList: TestCaseDropdownList) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(dropDownList);

    return this.http.post(APIEndpoint + ApiUrls.GetAllTestCaseStatuses, body, httpOptions);
  }

  GetTestCaseSections(suiteId) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    var paramsObj = new HttpParams().set("suiteId", suiteId);

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsObj
    };

    return this.http.get(APIEndpoint + ApiUrls.GetSectionsAndSubSections, httpOptions);
  }

  UpsertTestCase(testCase: TestCase) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(testCase);

    return this.http.post(APIEndpoint + ApiUrls.UpsertTestCase, body, httpOptions);
  }

  UpsertTestCaseScenario(testCaseScenarioDelete: TestCase) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(testCaseScenarioDelete);

    return this.http.post(APIEndpoint + ApiUrls.UpsertUserStoryScenario, body, httpOptions);
  }

  UpsertCopyOrMoveCases(copyOrMoveCases: TestCasesShift) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(copyOrMoveCases);

    return this.http.post(APIEndpoint + ApiUrls.UpsertCopyMoveCases, body, httpOptions);
  }

  ReorderTestCases(testcaseIdList: string[]) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(testcaseIdList);

    return this.http.post(APIEndpoint + ApiUrls.ReorderTestCases, body, httpOptions);
  }

  MoveTestCases(moveCasesModel: MoveTestCasesModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(moveCasesModel);

    return this.http.post(APIEndpoint + ApiUrls.MoveCasesToSection, body, httpOptions);
  }

  GetTestCaseById(testCaseId) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    var paramsObj = new HttpParams().set("testCaseId", testCaseId);

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsObj
    };

    return this.http.get(APIEndpoint + ApiUrls.GetTestCaseById, httpOptions);
  }

  GetTestCasesBySectionId(sectionDetails) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(sectionDetails);

    return this.http.post(APIEndpoint + ApiUrls.SearchTestCases, body, httpOptions);
  }

  UpdateTestCaseViewCount(caseDetails) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(caseDetails);

    return this.http.post(APIEndpoint + ApiUrls.InsertTestCaseHistory, body, httpOptions);
  }

  GetTestCasesByUserStoryId(searchCases) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(searchCases);

    return this.http.post(APIEndpoint + ApiUrls.GetUserStoryScenarios, body, httpOptions);
  }

  GetUserStoryScenarioHistory(historyModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(historyModel);

    return this.http.post(APIEndpoint + ApiUrls.GetUserStoryScenarioHistory, body, httpOptions);
  }

  GetBugsByUserStoryId(searchBugs) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(searchBugs);

    return this.http.post(APIEndpoint + ApiUrls.GetBugsBasedOnUserStories, body, httpOptions);
  }

  GetBugsByGoalId(searchBugs) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(searchBugs);

    return this.http.post(APIEndpoint + ApiUrls.GetBugsBasedOnUserStories, body, httpOptions);
  }

  GetTestCasesByFilters(searchDetails) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(searchDetails);

    return this.http.post(APIEndpoint + ApiUrls.GetTestCasesByFilters, body, httpOptions);
  }

  GetTestCaseDetailsByCaseId(caseDetails) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(caseDetails);

    return this.http.post(APIEndpoint + ApiUrls.SearchTestCaseDetailsById, body, httpOptions);
  }

  GetTestRunCaseDetailsByCaseId(caseDetails) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(caseDetails);

    return this.http.post(APIEndpoint + ApiUrls.SearchTestRunCaseDetailsById, body, httpOptions);
  }

  GetTestCasesBySectionAndRunId(sectionAndRunDetails) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(sectionAndRunDetails);

    return this.http.post(APIEndpoint + ApiUrls.SearchTestCasesByTestRunId, body, httpOptions);
  }

  UpsertTestCaseTitle(testCaseTitle: TestCaseTitle) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(testCaseTitle);

    return this.http.post(APIEndpoint + ApiUrls.UpsertMultipleTestCases, body, httpOptions);
  }

  UpsertMileStone(mileStone: MileStone) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(mileStone);

    return this.http.post(APIEndpoint + ApiUrls.UpsertMilestone, body, httpOptions);
  }

  GetMileStones(mileStone: MileStone) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(mileStone);

    return this.http.post(APIEndpoint + ApiUrls.SearchMilestones, body, httpOptions);
  }

  GetMileStoneDropdownList(projectId: string) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    var paramsObj = new HttpParams().set("projectId", projectId);

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsObj
    };

    return this.http.get(APIEndpoint + ApiUrls.GetMilestoneDropdownList, httpOptions);
  }

  GetTestRunsByMilestone(mileStone: any) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const paramsObj = { "projectId": mileStone.projectId, "milestoneId": mileStone.milestoneId };

    const body = JSON.stringify(paramsObj);

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post(APIEndpoint + ApiUrls.SearchTestRuns, body, httpOptions);
  }

  GetUsers(projectId: string) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    var paramsObj = new HttpParams().set("projectId", projectId);

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsObj
    };

    return this.http.get(APIEndpoint + ApiUrls.GetProjectMemberDropdown, httpOptions);
  }

  GetAllUsers() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    
    var data = { UserId: null, FirstName: null, sortDirectionAsc: 'true', isActive: true };

    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(data);

    return this.http.post(APIEndpoint + ApiUrls.GetAllUsers, body, httpOptions);
  }

  UpsertTestRun(testRun: TestRun) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(testRun);

    return this.http.post(APIEndpoint + ApiUrls.UpsertTestRun, body, httpOptions);
  }

  SearchTestRuns(testRun: TestRun) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(testRun);

    return this.http.post(APIEndpoint + ApiUrls.SearchTestRuns, body, httpOptions);
  }

  UpdateTestCaseStatus(assignToCase: TestCase) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(assignToCase);

    return this.http.post(APIEndpoint + ApiUrls.UpdateTestCaseStatus, body, httpOptions);
  }

  UpdateTestRunResultForTestCases(multiple: UpdateMultiple) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(multiple);

    return this.http.post(APIEndpoint + ApiUrls.UpdateTestRunResultForMultipleTestCases, body, httpOptions);
  }

  DeleteTestSuite(testSuite: TestSuite) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(testSuite);

    return this.http.post(APIEndpoint + ApiUrls.DeleteTestSuite, body, httpOptions);
  }

  DeleteTestsuiteSection(testSuiteSection: TestSuiteSection) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(testSuiteSection);

    return this.http.post(APIEndpoint + ApiUrls.DeleteTestSuiteSection, body, httpOptions);
  }

  DeleteTestCase(testCaseDelete: TestCaseTitle) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(testCaseDelete);

    return this.http.post(APIEndpoint + ApiUrls.DeleteTestCase, body, httpOptions);
  }

  DeleteTestRun(testRun: TestRun) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(testRun);

    return this.http.post(APIEndpoint + ApiUrls.DeleteTestRun, body, httpOptions);
  }

  DeleteMileStone(mileStone: MileStone) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(mileStone);

    return this.http.post(APIEndpoint + ApiUrls.DeleteMilestone, body, httpOptions);
  }

  SearchReports(searchReport: TestRailReport) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(searchReport);

    return this.http.post(APIEndpoint + ApiUrls.GetTestRailReports, body, httpOptions);
  }

  GetReportById(searchReportById: TestRailReport) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(searchReportById);

    return this.http.post(APIEndpoint + ApiUrls.GetTestRailReportById, body, httpOptions);
  }

  UpsertReport(report: TestRailReport) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(report);

    return this.http.post(APIEndpoint + ApiUrls.UpsertReport, body, httpOptions);
  }

  ShareReport(shareReport: ShareReport) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(shareReport);

    return this.http.post(APIEndpoint + ApiUrls.SendReportAsPdf, body, httpOptions);
  }

  GetTestTeamStatusReporting(shareReport: SplitBarReport) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(shareReport);

    return this.http.post(APIEndpoint + ApiUrls.GetTestTeamStatusReporting, body, httpOptions);
  }

  GetTestTeamStatusReportingProjectWise(shareReport: SplitBarReport) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(shareReport);

    return this.http.post(APIEndpoint + ApiUrls.GetTestTeamStatusReportingProjectWise, body, httpOptions);
  }

  UpsertUserStory(userStorySearchInput: UserStory) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(userStorySearchInput);

    return this.http.post<any>(APIEndpoint + ApiUrls.UpsertUserStory, body, httpOptions).pipe(
      map((result) => {
        return result;
      })
    );
  }

  GetUserStoryById(userStoryId: string,userStoryUniqueName: string = null) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    var paramsObj = new HttpParams().set("userStoryId", userStoryId);
    paramsObj = paramsObj.append("userStoryUniqueName", userStoryUniqueName);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsObj
    };

    return this.http
      .get(APIEndpoint + ApiUrls.GetUserStoryById, httpOptions).pipe(
        map((result) => {
          return result;
        })
      );
  }

  GetAllWorkFlowStatus(WorkflowStatusModel: WorkflowStatus) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    let paramsobj = new HttpParams().set("workFlowId", WorkflowStatusModel.workFlowId);
    paramsobj = paramsobj.set("isArchive", "false");
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsobj
    };

    let body = JSON.stringify(WorkflowStatusModel);

    return this.http
      .get(APIEndpoint + ApiUrls.GetAllWorkFlowStatus, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getAllPermittedEntityRoleFeatures(projectId: string) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    var entityFeatureModel = new EntityRoleFeatureModel();
    entityFeatureModel.projectId = projectId;

    let body = JSON.stringify(entityFeatureModel);

    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.post(APIEndpoint + ApiUrls.GetAllPermittedEntityRoleFeatures, body, httpOptions).pipe(
      map(result => {
        return result;
      })
    );;
  }
}