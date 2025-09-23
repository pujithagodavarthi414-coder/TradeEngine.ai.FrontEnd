import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { FeedTimeSheetModel } from '../models/feedTimeSheetModel';
import { EmployeeTimeFeedModel } from '../models/employeetimefeed';
import { ButtonTypeInputModel } from '../models/button-type.model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

import { Observable } from "rxjs";
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: "root"
})
export class TimesheetService {

  private Get_FeedTimeHistory_API_PATH = APIEndpoint + ApiUrls.GetFeedTimeHistory;
  private timeSheetEnabledInformation = new BehaviorSubject("");
  currenttimeSheetEnabledInformation = this.timeSheetEnabledInformation.asObservable();

  private timeSheetFeedInformation = new BehaviorSubject("");
  currenttimeSheetFeedInformation = this.timeSheetFeedInformation.asObservable();

  constructor(private http: HttpClient) { }

  getTimeSheetEnabledInformation() {
    return this.http.get<any>(
      APIEndpoint +
      `Timesheet/TimesheetApi/GetEnableorDisableTimesheetButtons`
    ).pipe(
      map(data => {
        this.timeSheetEnabledInformation.next(data);
        return data;
      })
    );
  }

  getTimeSheetFeedInformation() {
    return this.http.get<any>(
      APIEndpoint + `Timesheet/TimesheetApi/GetTimesheetHistoryDetails`
    ).pipe(
      map(data => {
        this.timeSheetFeedInformation.next(data);
        return data;
      })
    );
  }

  getButtonTypeDetails(buttonTypeInputModel: ButtonTypeInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = JSON.stringify(buttonTypeInputModel);
    return this.http.post(APIEndpoint + ApiUrls.GetAllButtonTypes, body, httpOptions);
  }

  getFeedTimeHistory() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let employeeTimeFeedModel = new EmployeeTimeFeedModel();
    employeeTimeFeedModel.teamLeadId = '';
    employeeTimeFeedModel.branchId = null;
    employeeTimeFeedModel.dateFrom = new Date();;
    employeeTimeFeedModel.dateTo = new Date();;
    let body = JSON.stringify(employeeTimeFeedModel);

    return this.http.post<any>(this.Get_FeedTimeHistory_API_PATH, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  logTimeSheetEntry(feedTimeSheetModel: FeedTimeSheetModel) {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(feedTimeSheetModel);

    return this.http.post<any>(APIEndpoint +
      `Timesheet/TimeSheetApi/UpsertUserPunchCard`, body, httpOptions)
      .pipe(map(data => {
        return data;
      })
      );
  }

  GetLoggingComplainceDetails() {
    return this.http.get<any>(
      APIEndpoint + `TimeSheet/TimeSheetApi/GetLoggingCompliance`
    ).pipe(
      map(data => {
        this.timeSheetFeedInformation.next(data);
        return data;
      })
    );
  }
}
