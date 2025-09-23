import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { EmployeeListModel } from '../models/employee-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { CronExpressionModel } from '../models/cron-expression-model';
import { UserStory } from '../models/userStory';
import { UserstoryTypeModel } from "../models/user-story-type-model";
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;
import { Observable } from "rxjs";
import { WebAppUsageSearchModel } from '../models/web-app-usage-search-model';
import { DeleteScreenShotModel } from '../models/delete-screenshot-model';

@Injectable({
  providedIn: "root"
})

export class MasterDataManagementService {

  constructor(private http: HttpClient) { }

  
  getAllEmployees(employeeModel: EmployeeListModel) {
    const httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = JSON.stringify(employeeModel);
    return this.http.post(`${APIEndpoint + ApiUrls.GetAllEmployees}`, body, httpOptions)
        .pipe(map(result => {
            return result;
        }));
}



  getGenericApiData(model: any) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(model);
    return this.http.post(APIEndpoint + "BusinessSuite/BusinessSuiteApi/UpsertData", body, httpOptions).pipe(map((result) => {
      return result;
    }));
  }

  UpsertRecurringUserStory(recurringUserStoryModel: UserStory) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(recurringUserStoryModel);

    return this.http.post(APIEndpoint + "UserStory/UserStoryApi/UpsertRecurringUserStory", body, httpOptions).pipe(map((result) => {
      return result;
    }));
  }

  
  SearchUserStoryTypes(userstoryType: UserstoryTypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userstoryType);

    return this.http.post(APIEndpoint + ApiUrls.GetUserStoryTypes, body, httpOptions);
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

  getConductQuestionsforActionLinking(projectId, questionName) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;

    var paramsObj = new HttpParams().set("projectId", projectId).set("questionName", questionName);

    const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        params: paramsObj
    }

    return this.http.get(APIEndpoint + ApiUrls.GetConductQuestionsForActionLinking, httpOptions)
        .pipe(map(result => {
            return result;
        }));
}

}



