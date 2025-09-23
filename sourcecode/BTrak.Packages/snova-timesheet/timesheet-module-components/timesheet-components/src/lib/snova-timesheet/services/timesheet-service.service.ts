import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ButtonTypeInputModel } from '../models/button-type-input-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { EmployeeTimeFeedModel } from '../models/employeetimefeed';
import { FeedTimeSheetModel } from '../models/feedTimeSheetModel';
import { UserStoryLogTimeModel } from '../models/userStoryLogTimeModel';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { TimeUsageDrillDownModel } from '../models/time-usage-drill-down-model';
import { TrackerTimeModel } from '../models/tracker-time.model';
import { WorkLoggingReportModel } from '../models/workLoggingReport';
import { SearchCommitModel } from '../models/search-repository-commits.model';

@Injectable({ providedIn: "root" })

export class TimesheetService {
  private timeSheetEnabledInformation = new BehaviorSubject("");
  currenttimeSheetEnabledInformation = this.timeSheetEnabledInformation.asObservable();

  private timeSheetFeedInformation = new BehaviorSubject("");
  currenttimeSheetFeedInformation = this.timeSheetFeedInformation.asObservable();

  constructor(private http: HttpClient) { }

  getTimeSheetEnabledInformation() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.get<any>(APIEndpoint + ApiUrls.GetEnableorDisableTimesheetButtons, httpOptions).pipe(
      map(data => {
        this.timeSheetEnabledInformation.next(data);
        return data;
      })
    );
  }

  getTimeSheetFeedInformation() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.get<any>(APIEndpoint + ApiUrls.GetTimesheetHistoryDetails, httpOptions).pipe(
      map(data => {
        this.timeSheetFeedInformation.next(data);
        return data;
      })
    );
  }

  getFeedTimeHistory() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let employeeTimeFeedModel = new EmployeeTimeFeedModel();
    employeeTimeFeedModel.teamLeadId = '';
    employeeTimeFeedModel.branchId = null;
    employeeTimeFeedModel.dateFrom = new Date();;
    employeeTimeFeedModel.dateTo = new Date();;
    let body = JSON.stringify(employeeTimeFeedModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.GetFeedTimeHistory, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  logTimeSheetEntry(feedTimeSheetModel: FeedTimeSheetModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(feedTimeSheetModel);
    return this.http.post<any>(APIEndpoint + ApiUrls.UpsertUserPunchCard, body, httpOptions)
      .pipe(map(data => {
        return data;
      }));
  }

  GetLoggingComplainceDetails() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.get<any>(APIEndpoint + ApiUrls.GetLoggingCompliance, httpOptions).pipe(
      map(data => {
        this.timeSheetFeedInformation.next(data);
        return data;
      })
    );
  }

  getUserIpDetails() {
    const httpOptions = {
      headers: new HttpHeaders(),
    };
    return this.http.get('http://ip-api.com/json/', httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getButtonTypeDetailsgetButtonTypeDetails(buttonTypeInputModel: ButtonTypeInputModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(buttonTypeInputModel);
    return this.http.post(APIEndpoint + ApiUrls.GetAllButtonTypes, body, httpOptions);
  }

  getButtonTypeDetails(buttonTypeInputModel: ButtonTypeInputModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(buttonTypeInputModel);
    return this.http.post(APIEndpoint + ApiUrls.GetAllButtonTypes, body, httpOptions);
  }

  UpsertUserStoryLogTimeFromPuncCard(isBreakStarted) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    return this.http.post(APIEndpoint + ApiUrls.UpsertUserstoryLogTimeBasedOnPunchCard + "?BreakStarted=" + isBreakStarted, httpOptions).pipe(map(result => {
      return result;
    }));
  }

  UpsertUserStoryLogTime(userStoryLogTimeModel: UserStoryLogTimeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(userStoryLogTimeModel);
    return this.http.post(APIEndpoint + ApiUrls.InsertUserStoryLogTime, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
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
      .post(APIEndpoint + ApiUrls.GetTimeUsageDrillDown, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  SearchRepositoryCommits(searchCommitModel: SearchCommitModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    let body = JSON.stringify(searchCommitModel);
    return this.http
      .post(APIEndpoint + ApiUrls.SearchRepositoryCommits, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getTrackingTime(trackerTimeModel: TrackerTimeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(trackerTimeModel);
    return this.http.post(APIEndpoint + ApiUrls.GetTrackingData, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getWorkLogging(WorkLoggingReportModel: WorkLoggingReportModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(WorkLoggingReportModel);
    return this.http.post(APIEndpoint + ApiUrls.GetEmployeeWorkLogReport, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
}