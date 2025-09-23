import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ProductivityDashboardModel } from '../models/productivityDashboardModel';
import { WorkAllocation } from '../models/workAllocation';
import { Branch } from '../models/branch';
import { BugReportModel } from '../models/bugReportData';
import { WorkLoggingReportModel } from '../models/workLoggingReport';
import { ProductivityReportModel } from '../models/productivityReport';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { ProjectSearchCriteriaInputModel } from '../models/project-search-criteria-input.model';
import { Project } from '../models/project.model';
import { UserModel } from '../models/user-details.model';
import { WorkflowStatusesModel } from '../models/work-flow-statuses.model';

import { Observable } from "rxjs";
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root',
})

export class ProductivityDashboardService {

  constructor(private http: HttpClient) { }

  private EMPLOYEE_INDEX_API_PATH = APIEndpoint + ApiUrls.GetProductivityIndexForDevelopers;
  private DEV_QUALITY_API_PATH = APIEndpoint + ApiUrls.GetUserStoryStatuses;
  private QA_PERFORMANCE_API_PATH = APIEndpoint + ApiUrls.GetQaPerformance;
  private USERSTORIES_APPROVAL_API_PATH = APIEndpoint + ApiUrls.GetUserStoriesWaitingForQaApproval;
  private PROJECT_SEARCH_API_PATH = APIEndpoint + ApiUrls.SearchProjects;
  private EMPLOYEE_USERS_TORIES_SEARCH_API_PATH = APIEndpoint + ApiUrls.GetEmployeeUserStories;
  private Get_All_Status_API_PATH = APIEndpoint + ApiUrls.GetAllStatuses;
  private USERS_SEARCH_API_PATH = APIEndpoint + ApiUrls.GetAllUsers;
  private BRANCH_SEARCH_API_PATH = APIEndpoint + ApiUrls.GetAllBranches;
  private WorkAllocationSummary_SEARCH_API_PATH = APIEndpoint + ApiUrls.GetEmployeeWorkAllocation;
  private EverydayTargetStatus_SEARCH_API_PATH = APIEndpoint + ApiUrls.GetEveryDayTargetStatus;
  private BUG_REPORT_API_PATH = APIEndpoint + ApiUrls.GetBugReport;
  private EMPLOYEE_INDEX_USERSTORIES_API_PATH = APIEndpoint + ApiUrls.GetProductivityIndexUserStoriesForDevelopers;

  getProductivityIndexForDevelopers(productivityDashboard: ProductivityDashboardModel) {
    let body = JSON.stringify(productivityDashboard);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
    };
    return this.http.post<any[]>(`${this.EMPLOYEE_INDEX_API_PATH}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetUserStoryStatuses(productivityDashboard: ProductivityDashboardModel) {
    let body = JSON.stringify(productivityDashboard);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
    };
    return this.http.post<any[]>(`${this.DEV_QUALITY_API_PATH}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getQaPerformance(productivityDashboard: ProductivityDashboardModel) {
    let body = JSON.stringify(productivityDashboard);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
    };
    return this.http.post<any[]>(`${this.QA_PERFORMANCE_API_PATH}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetUserStoriesWaitingForQaApproval(productivityDashboard: ProductivityDashboardModel) {
    let body = JSON.stringify(productivityDashboard);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
    };
    return this.http.post<any[]>(`${this.USERSTORIES_APPROVAL_API_PATH}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllProjects() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    var projects = new ProjectSearchCriteriaInputModel();
    projects.isArchived = false;
    let body = JSON.stringify(projects);
    return this.http.post<Project[]>(
      `${this.PROJECT_SEARCH_API_PATH}`,
      body,
      httpOptions
    );
  }

  getEmployeeUserStories(productivityDashboard: ProductivityDashboardModel) {
    let body = JSON.stringify(productivityDashboard);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
    };
    return this.http.post<any[]>(`${this.EMPLOYEE_USERS_TORIES_SEARCH_API_PATH}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllStatus() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(new WorkflowStatusesModel());
    return this.http.post(`${this.Get_All_Status_API_PATH}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllUsers(userModel: UserModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' })
    };
    let body = JSON.stringify(userModel);
    return this.http.post(`${this.USERS_SEARCH_API_PATH}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  searchUsers(userModel: UserModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' })
    };
    let body = JSON.stringify(userModel);
    return this.http.post(`${this.USERS_SEARCH_API_PATH}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getEmployeeWorkAllocation(workAllocation: WorkAllocation) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' })
    };
    let body = JSON.stringify(workAllocation);
    return this.http.post(`${this.WorkAllocationSummary_SEARCH_API_PATH}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getBranchesList() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' })
    };
    let body = JSON.stringify(new Branch());
    return this.http.post(`${this.BRANCH_SEARCH_API_PATH}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getEverydayTargetStatus(entityId) {
    let paramsObj = new HttpParams().set("entityId",entityId);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
      params: paramsObj
    };
    return this.http.get(`${this.EverydayTargetStatus_SEARCH_API_PATH}`, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllBugReports(bugReport: BugReportModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' })
    };
    let body = JSON.stringify(bugReport);
    return this.http.post(`${this.BUG_REPORT_API_PATH}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  parse(value: any): Date | null {
    if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
      const str = value.split('/');
      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      return new Date(year, month, date);
    } else if ((typeof value === 'string') && value === '') {
      return new Date();
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }

  getWorkLogging(WorkLoggingReportModel: WorkLoggingReportModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(WorkLoggingReportModel);
    return this.http.post(APIEndpoint + ApiUrls.GetEmployeeWorkLogReport, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getProductivityReport(ProductivityReportModel: ProductivityReportModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(ProductivityReportModel);
    return this.http.post(APIEndpoint + ApiUrls.GetEmployeeYearlyProductivityReport, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getEntityDropDown(searchText) {
    let paramsobj = new HttpParams().set('searchText', searchText);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization': 'my-auth-token'}),
      params: paramsobj
    };
   
    return this.http.get(`${APIEndpoint + ApiUrls.GetEntityDropDown}`,httpOptions)
    .pipe(map(result => {
    return result;
    }));
  }

  getProductivityIndexUserStoriesForDevelopers(productivityDashboard: ProductivityDashboardModel) {
    let body = JSON.stringify(productivityDashboard);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
    };
    return this.http.post<any[]>(`${this.EMPLOYEE_INDEX_USERSTORIES_API_PATH}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
}