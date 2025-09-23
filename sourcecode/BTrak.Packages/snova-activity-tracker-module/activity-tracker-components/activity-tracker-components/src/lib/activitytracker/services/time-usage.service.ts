import { Injectable } from "@angular/core";
import {
  HttpHeaders,
  HttpResponse,
  HttpClient,
  HttpParams
} from "@angular/common/http";

import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { EmployeeOfRoleModel } from "../models/employee-of-role-model";
import { EmployeeModel } from "../models/employee-model";
import { TimeSheetSearchModel } from "../models/time-sheet-search-model";
import { WebAppUsageSearchModel } from "../models/web-app-usage-search-model";
import { TrackedInformationOfUserStoryModel } from "../models/trackedinformation-of-userstory.model";
import { TimeUsageDrillDownModel } from "../models/time-usage-drill-down-model";
import { EmployeeAppUsageSearch } from "../models/employee-app-usage-search";
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { DeleteScreenShotModel } from '../models/delete-screenshot-model';
import { SelectBranch } from '../models/select-branch';
import { Persistance } from '../models/persistance.model';
import { DepartmentModel } from '../models/department-model';
import { RoleSearchCriteriaInputModel } from '../models/roleSearchCriteria';
import { Branch } from '../models/branch';
import * as moment_ from "moment";
const moment = moment_;
import { EmployeeDetailsSearchModel } from '../models/employee-details-search-model';
import { SoftLabelConfigurationModel } from '../models/softlabels-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { DashboardList } from "@snovasys/snova-widget-module/lib/widget-module/dependencies/models/dashboardList";
import { ActivityHistoryModel } from '../models/activity-history.model';
import { DynamicDashboardFilterModel } from "../models/dynamic-dashboard-filter.model";
let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: "root"
})
export class TimeUsageService {
  constructor(private http: HttpClient) { }

  getAllEmployee(employeeOfRoleModel: EmployeeOfRoleModel) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    let body = JSON.stringify(employeeOfRoleModel);
    return this.http
      .post(`${APIEndpoint + ApiUrls.GetEmployees}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getTeamLeadsList(model: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(model);
    return this.http.post(`${APIEndpoint + ApiUrls.GetMyTeamMembersList}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getTotalTimeSpentApplications(timeSheetSearch: TimeSheetSearchModel) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    let body = JSON.stringify(timeSheetSearch);
    return this.http
      .post(`${APIEndpoint + ApiUrls.GetTotalTimeUsageOfApplicationsByUsers}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  UpsertCustomDashboardFilter(dashboardFilterModel: DynamicDashboardFilterModel) {
		const httpOptions = {
			headers: new HttpHeaders({ "Content-Type": "application/json" })
		};
		const body = JSON.stringify(dashboardFilterModel);

		return this.http.post(APIEndpoint + ApiUrls.UpsertDashboardFilter, body, httpOptions);
	}

  GetCustomizedDashboardId(dashboard: DashboardList) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(dashboard);

    return this.http.post(APIEndpoint + ApiUrls.GetCustomizedDashboardId, body, httpOptions);
  }

  getTimeUsageDrillDown(timeUsageDrillDown: TimeUsageDrillDownModel) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    let body = JSON.stringify(timeUsageDrillDown);
    return this.http
      .post(`${APIEndpoint + ApiUrls.GetTimeUsageDrillDown}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getWebAppTimeUsage(webAppUsageSearch: WebAppUsageSearchModel) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    let body = JSON.stringify(webAppUsageSearch);
    return this.http
      .post(`${APIEndpoint + ApiUrls.GetWebAppUsageTime}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getTrackedInformationOfUserStory(trackedInformationOfUserStoryModel: TrackedInformationOfUserStoryModel) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    let body = JSON.stringify(trackedInformationOfUserStoryModel);
    return this.http
      .post(`${APIEndpoint + ApiUrls.GetTrackedInformationOfUserStory}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getAppUsageCompleteReport(appUsageSearch: EmployeeAppUsageSearch) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    let body = JSON.stringify(appUsageSearch);
    return this.http
      .post(`${APIEndpoint + ApiUrls.GetAppUsageCompleteReport}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getAppUsageUserStoryReport(appUsageSearch: EmployeeAppUsageSearch) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    let body = JSON.stringify(appUsageSearch);
    return this.http
      .post(`${APIEndpoint + ApiUrls.GetAppUsageUserStoryReport}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getAppUsageTimesheetReport(appUsageSearch: EmployeeAppUsageSearch) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    let body = JSON.stringify(appUsageSearch);
    return this.http
      .post(`${APIEndpoint + ApiUrls.GetAppUsageTimesheetReport}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getActTrackerAppReportUsage(webAppUsageSearch: WebAppUsageSearchModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(webAppUsageSearch);
    return this.http.post(APIEndpoint + ApiUrls.GetActTrackerAppReportUsage, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  getActTrackerAppReportUsageForChart(webAppUsageSearch: WebAppUsageSearchModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(webAppUsageSearch);
    return this.http.post(APIEndpoint + ApiUrls.GetActTrackerAppReportUsageForChart, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  getActTrackerUserActivityScreenshots(webAppUsageSearchModel: WebAppUsageSearchModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(webAppUsageSearchModel);
    return this.http.post(APIEndpoint + ApiUrls.GetActTrackerUserActivityScreenshots, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  deleteMultipleScreenshots(deleteScreenShotModel: DeleteScreenShotModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(deleteScreenShotModel);
    return this.http.post(APIEndpoint + ApiUrls.MultipleDeleteScreenShot, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  getActivityTrackerUserStatus(webAppUsage: WebAppUsageSearchModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(webAppUsage);

    return this.http.post(APIEndpoint + ApiUrls.GetActTrackerUserStatus, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  getLoggedInUser() {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return this.http.get(`${APIEndpoint + ApiUrls.GetLoggedInUser}`, httpOptions).pipe(
      map(result => {
        return result;
      })
    );
  }

  getAllBranches(selectbranch: SelectBranch) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(selectbranch);
    return this.http
      .post(APIEndpoint + ApiUrls.GetAllBranches, body, httpOptions)
      .pipe(
        map(result => {
          console.log(" result:", result);
          return result;
        })
      );
  }

  UpsertPersistance(inputModel: Persistance) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(inputModel);

    return this.http.post(APIEndpoint + ApiUrls.UpdatePersistance, body, httpOptions);
  }

  GetPersistance(searchModel: Persistance) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(searchModel);

    return this.http.post(APIEndpoint + ApiUrls.GetPersistance, body, httpOptions);
  }

  getdepartment(departmentModel: DepartmentModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(departmentModel);

    return this.http.post(APIEndpoint + ApiUrls.GetDepartments, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getAllRoles() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    var roleSearchCriteriaModel = new RoleSearchCriteriaInputModel();
    roleSearchCriteriaModel.isArchived = false;
    var data = { RoleId: null, RoleName: null, Data: null };
    console.log(data);
    let body = JSON.stringify(roleSearchCriteriaModel);

    return this.http
      .post(APIEndpoint + "Roles/RolesApi/GetAllRoles", body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getBranchesList() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' })
    };
    var branch = new Branch();
    branch.isArchived = false;
    let body = JSON.stringify(branch);
    return this.http.post(APIEndpoint + ApiUrls.GetAllBranches, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getEmployeeDetails(employeeDetailsSearchModel: EmployeeDetailsSearchModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(employeeDetailsSearchModel);
    return this.http.post(APIEndpoint + ApiUrls.GetEmployeeDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getSoftLabelConfigurations(softLabels: SoftLabelConfigurationModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(softLabels);

    return this.http.post(`${APIEndpoint + ApiUrls.GetSoftLabelConfigurations}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getIdleTimeReport(appUsageSearch: EmployeeAppUsageSearch) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    let body = JSON.stringify(appUsageSearch);
    return this.http
      .post(`${APIEndpoint + ApiUrls.GetIdleAndInactiveTimeForEmployee}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  GetActivityTrackerHistory(activityHistoryModel: ActivityHistoryModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(activityHistoryModel);

    return this.http.post(APIEndpoint + ApiUrls.GetActivityTrackerHistory, body, httpOptions);
  }

}
