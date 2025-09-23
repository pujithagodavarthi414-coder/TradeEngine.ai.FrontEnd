import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from "rxjs";

import { TimeSheetManagementSearchInputModel, BranchModel, TimeSheetPermissionsInputModel } from '../models/timesheet-model';
import { UserStorySpentTimeInputModel } from '../models/user-story-spent-model';
import { TimeSheetModel } from '../models/time-sheet-model';
import { EmployeeLeaveModel } from '../models/employee-leave-model';
import { PermissionReasonModel } from '../models/permission-reason-model';
import { TimeSheetManagementPermissionModel } from '../models/time-sheet-management-permission-model';

import { BreakModel } from '../models/break-model';
import { LeaveTypeModel } from '../models/leave-type-model';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { LeaveSessionModel } from '../models/leave-session-model';
import { ProjectSearchCriteriaInputModel } from '../models/ProjectSearchCriteriaInputModel';
import { Project } from '../models/project';
import { UserModel } from '../models/user';
import { TimeZoneModel } from '../models/leavesession-model';
import { WebAppUsageSearchModel } from '../models/web-app-usage-search-model';
import { DeleteScreenShotModel } from '../models/delete-screenshot-model';
import { KpiSearchModel } from '../models/kpi-search.model';

@Injectable({
  providedIn: 'root',
})

export class TimeSheetService {

  constructor(private http: HttpClient) { }

  getAllLeaveTypes(leaveTypeModel: LeaveTypeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(leaveTypeModel);
    return this.http.post(APIEndpoint + ApiUrls.GetAllLeaveTypes, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllAbsentSessions(leaveSessionsModel: LeaveSessionModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(leaveSessionsModel);
    return this.http.post(APIEndpoint + ApiUrls.GetAllLeaveSessions, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllPermissionReasons() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(new PermissionReasonModel());
    return this.http.post<any[]>(APIEndpoint + ApiUrls.GetAllPermissionReasons, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  saveTimeSheet(timeSheetModel: TimeSheetModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(timeSheetModel);
    return this.http.post(APIEndpoint + ApiUrls.UpsertTimeSheet, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  saveTimeSheetPermission(timeSheetManagementPermissionModel: TimeSheetManagementPermissionModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(timeSheetManagementPermissionModel);
    return this.http.post(APIEndpoint + ApiUrls.UpsertTimeSheetPermissions, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  deleteTimeSheetPermission(timeSheetManagementPermissionModel: TimeSheetManagementPermissionModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(timeSheetManagementPermissionModel);
    return this.http.post(APIEndpoint + ApiUrls.DeletePermission, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  saveTimeSheetAbsent(employeeLeaveModel: EmployeeLeaveModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(employeeLeaveModel);
    return this.http.post(APIEndpoint + ApiUrls.UpsertEmployeeAbsence, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getTimeSheetDetails(timeSheetManagementSearchInputModel: TimeSheetManagementSearchInputModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(timeSheetManagementSearchInputModel);
    return this.http.post(APIEndpoint + ApiUrls.GetTimeSheetDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  downloadTimesheet(timeSheetManagementSearchInputModel: TimeSheetManagementSearchInputModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(timeSheetManagementSearchInputModel);
    return this.http.post(APIEndpoint + ApiUrls.GetTimeSheetDetailsUploadTemplate, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllBranches(branchModel: BranchModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(branchModel);
    return this.http.post(APIEndpoint + ApiUrls.GetAllBranches, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllTimeZones(timeZoneModel: TimeZoneModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(timeZoneModel);
    return this.http.post(APIEndpoint + ApiUrls.GetAllTimeZones, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getPermissionDetails(timeSheetPermissionsInputModel: TimeSheetPermissionsInputModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(timeSheetPermissionsInputModel);
    return this.http.post(APIEndpoint + ApiUrls.GetTimeSheetPermissions, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getPermissionRegister(timeSheetPermissionsInputModel: TimeSheetPermissionsInputModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(timeSheetPermissionsInputModel);
    return this.http.post(APIEndpoint + ApiUrls.SearchPermissionRegister, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getSpentTimeDetails(userStorySpentTimeInputModel: UserStorySpentTimeInputModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let body = JSON.stringify(userStorySpentTimeInputModel);
    return this.http.post(APIEndpoint + ApiUrls.SearchSpentTimeReport, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  saveTimeSheetPermissionReason(timeSheetPermissionReason: PermissionReasonModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(timeSheetPermissionReason);
    return this.http.post(APIEndpoint + ApiUrls.UpsertTimeSheetPermissionReasons, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getviewTimeSheet(TimeSheetDetails: TimeSheetManagementSearchInputModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(TimeSheetDetails);
    return this.http.post(APIEndpoint + ApiUrls.GetMyTimeSheetDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllBreaks(breakModel: BreakModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(breakModel);
    return this.http.post(APIEndpoint + ApiUrls.GetUserBreakDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertBreakDetails(breakModel: BreakModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(breakModel);
    return this.http.post(APIEndpoint + ApiUrls.UpsertBreakDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getEntityDropDown(searchText) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    let paramsobj = new HttpParams().set('searchText', searchText);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
      params: paramsobj
    };
    return this.http.get(APIEndpoint + ApiUrls.GetEntityDropDown, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllProjects() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    var projects = new ProjectSearchCriteriaInputModel();
    projects.isArchived = false;
    let body = JSON.stringify(projects);
    return this.http.post<Project[]>(APIEndpoint + ApiUrls.SearchProjects, body, httpOptions);
  }

  getAllUsers(userModel: UserModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' })
    };
    let body = JSON.stringify(userModel);
    return this.http.post(APIEndpoint + ApiUrls.GetAllUsers, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  searchUsers(userModel: UserModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' })
    };
    let body = JSON.stringify(userModel);
    return this.http.post(APIEndpoint + ApiUrls.GetAllUsers, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getTeamLeadsList(searchModel: any) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(searchModel);
    return this.http.post(`${APIEndpoint + ApiUrls.GetMyTeamMembersList}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getActTrackerUserActivityScreenshots(webAppUsageSearchModel: WebAppUsageSearchModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
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

  getActTrackerUserActivityScreenshotsById(webAppUsageSearchModel: WebAppUsageSearchModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(webAppUsageSearchModel);
    return this.http.post(APIEndpoint + ApiUrls.GetActTrackerUserActivityScreenshotsBasedOnId, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  deleteMultipleScreenshots(deleteScreenShotModel: DeleteScreenShotModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
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

  getAllLateUsers(inputModel: KpiSearchModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(inputModel);
    return this.http.post(APIEndpoint + ApiUrls.GetAllLateUsers, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  getAllAbsenceUsers(inputModel: KpiSearchModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(inputModel);
    return this.http.post(APIEndpoint + ApiUrls.GetAllAbsenceUsers, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }
}