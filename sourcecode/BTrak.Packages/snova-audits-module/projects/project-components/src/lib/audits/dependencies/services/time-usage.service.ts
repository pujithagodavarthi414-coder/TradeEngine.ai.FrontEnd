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
import { EmployeeModel } from "../models/employee-model-timesheet";
import { ApiUrls } from "../constants/api-urls";
import { TimeSheetSearchModel } from "../models/time-sheet-search-model";
import { WebAppUsageSearchModel } from "../models/web-app-usage-search-model";
import { TrackedInformationOfUserStoryModel } from "../models/trackedinformation-of-userstory.model";
import { TimeUsageDrillDownModel } from "../models/time-usage-drill-down-model";
import { EmployeeAppUsageSearch } from "../models/employee-app-usage-search";
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Injectable({
  providedIn: "root"
})
export class TimeUsageService {
  constructor(private http: HttpClient) { }
  employees: EmployeeModel[];

  getAllEmployee(employeeOfRoleModel: EmployeeOfRoleModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
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

  getTotalTimeSpentApplications(timeSheetSearch: TimeSheetSearchModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
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

  getTimeUsageDrillDown(timeUsageDrillDown: TimeUsageDrillDownModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
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
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
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
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
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
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
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
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
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
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
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

}
