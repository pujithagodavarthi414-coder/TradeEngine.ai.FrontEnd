import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { RolesModel } from '../models/role-model';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { ActivityModel } from '../models/activity-tracker.model';
import { ScreenshotFrequencyModel } from '../models/screenshot-frequency-model';
import { EmployeeOfRoleModel } from '../models/employee-of-role-model';
import { AddAppUrlModel } from '../models/add-app-url-model';
import { GetAppUrlsModel } from '../models/get-app-urls-model';
import { WebAppUsageSearchModel } from '../models/web-app-usage-search-model';
import { DeleteScreenShotModel } from '../models/delete-screenshot-model';
import { ActivityConfigurationStateModel } from '../models/activity-configuration-state-model';
import { ActivityConfigurationUserModel } from '../models/activity-configuration-user-model';
import { Observable } from 'rxjs/observable';
import { SelectBranch } from '../models/select-branch';
import { DepartmentModel } from '../models/department-model';
import { EmployeeDetailsSearchModel } from '../models/employee-details-search-model';
import { Persistance } from '../models/persistance.model';
import { EmployeeAppUsageSearch } from '../models/employee-app-usage-search';
import { ConfigInputModel } from '../models/config-input-model';
import { TopSitesModel } from '../models/top-sites.model';
import { ApplicationCategoryModel } from '../models/application-category.model';


let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;


@Injectable({
  providedIn: 'root',
})

export class ActivityTrackerService {

  constructor(private http: HttpClient) { }

  private GET_All_ActTrackerAppUrl = APIEndpoint + ApiUrls.getActTrackerAppUrlType;
  private EMPLOYEE_INTRO_API_PATH = APIEndpoint + "Intro/IntroApiController/GetIntro";

  getAllRoles(roleModel: RolesModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(roleModel);
    return this.http.post(APIEndpoint + ApiUrls.GetAllRoles, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  upsertActTrackerRolePermission(ActivityModel: ActivityModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(ActivityModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertActTrackerRolePermission, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  UpsertActTrackerRoleConfiguration(ActivityModel: ActivityModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(ActivityModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertActTrackerRoleConfiguration, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }


  getActTrackeUrls() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.get<any[]>(APIEndpoint + ApiUrls.getActTrackerAppUrlType, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertApplicationCategory(applicationCategoryModel: ApplicationCategoryModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(applicationCategoryModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertApplicationCategory, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  getAllApplicationCategories(applicationCategoryModel: ApplicationCategoryModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    const body = JSON.stringify(applicationCategoryModel);

    return this.http.post(APIEndpoint + ApiUrls.GetApplicationCategory, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  getActTrackerRoleConfigurationRoles() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.get<any[]>(APIEndpoint + ApiUrls.GetActTrackerRoleConfigurationRoles, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getActScreenshotfrequency() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.get<any[]>(APIEndpoint + ApiUrls.GetActTrackerScreenShotFrequencyRoles, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

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

  upsertActTrackerScreenShotFrequency(screenshotFrequencyModel: ScreenshotFrequencyModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(screenshotFrequencyModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertActTrackerScreenShotFrequency, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  UpsertRoleDropdown(ActivityModel: ActivityModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(ActivityModel);

    return this.http.post(APIEndpoint + ApiUrls.GetActTrackerRoleDropDown, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  getActTrackerAppUrlType() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' })
    };
    return this.http.get(`${this.GET_All_ActTrackerAppUrl}`, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getDeleteScreenshot(activityModel: ActivityModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' })
    };
    let body = JSON.stringify(activityModel);

    return this.http.get(`${this.GET_All_ActTrackerAppUrl}`, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getRemainingRoles(ActivityModel: ActivityModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(ActivityModel);

    return this.http.post(APIEndpoint + ApiUrls.GetActTrackerRolePermissionRoles, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertActTrackerAppUrls(AddAppUrl: AddAppUrlModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(AddAppUrl);
    return this.http.post(APIEndpoint + ApiUrls.UpsertActTrackerAppUrls, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  getActTrackerAppUrls(getAppUrlsModel: GetAppUrlsModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(getAppUrlsModel);
    return this.http.post(APIEndpoint + ApiUrls.GetActTrackerAppUrls, body, httpOptions)
      .pipe(map(result => {
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

  getActTrackerRecorder() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.get(APIEndpoint + ApiUrls.GetActTrackerRecorder, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  upsertActivityTrackerConfigurationState(activityConfigurationStateModel: ActivityConfigurationStateModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(activityConfigurationStateModel);
    return this.http.post(APIEndpoint + ApiUrls.UpsertActivityTrackerConfigurationState, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  getActivityTrackerConfigurationState() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.get(APIEndpoint + ApiUrls.GetActivityTrackerConfigurationState, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }

  upsertActivityTrackerUserConfiguration(activityConfigurationUser: ActivityConfigurationUserModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(activityConfigurationUser);
    return this.http.post(APIEndpoint + ApiUrls.UpsertActivityTrackerUserConfiguration, body, httpOptions)
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
  // : Observable<any>
  UploadFile(formData, moduleTypeId) {
    const httpOptions = {
      headers: new HttpHeaders({ enctype: "multipart/form-data" })
    };

    return this.http
      .post(`${APIEndpoint + ApiUrls.UploadFile}?moduleTypeId=` + moduleTypeId, formData, httpOptions)
      .pipe(
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

  getActivityTrackerModes() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.get<any[]>(APIEndpoint + ApiUrls.GetActivityTrackerModes, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertActivityTrackerModeConfig(conifgModel: ConfigInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    let body = JSON.stringify(conifgModel);
    return this.http
      .post(`${APIEndpoint + ApiUrls.UpsertActivityTrackerModeConfig}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getActivityTrackerModeConfig() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.get<any[]>(APIEndpoint + ApiUrls.GetActivityTrackerModeConfig, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getCompanyStatus() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.get<any[]>(APIEndpoint + ApiUrls.GetCompanyStatus, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getTeamActivity(topSitesModel: TopSitesModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(topSitesModel);
    return this.http.post(APIEndpoint + ApiUrls.GetTeamActivity, body, httpOptions)
      .pipe(map(result => {
        return result;
      })
      );
  }
  upsertIntroDetails() {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
    };
    return this.http.post<any[]>(`${this.EMPLOYEE_INTRO_API_PATH}`, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
}