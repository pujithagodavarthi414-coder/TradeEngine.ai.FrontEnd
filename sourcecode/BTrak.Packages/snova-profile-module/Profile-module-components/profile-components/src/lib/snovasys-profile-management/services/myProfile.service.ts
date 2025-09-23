import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { TimeSheetAuditModel } from '../models/timeSheetAuditModel';
import { ImminentDeadLineData } from '../models/imminentDeadLineData';
import { UploadProfileImageModel } from '../models/upload-profile-image-model';
import { HistoricalWorkReportModel } from '../models/historicalWorkReport';
import { ProfileModel } from '../models/profile-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';

import { Observable } from "rxjs";
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root',
})

export class MyProfileService {

  constructor(private http: HttpClient) { }

  getAllTimeSheets(timeSheetAuditModel: TimeSheetAuditModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(timeSheetAuditModel);
    return this.http.post(APIEndpoint + ApiUrls.GetUserFeedTimeHistory, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getAllUserStories(ImminentDeadLineData: ImminentDeadLineData) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(ImminentDeadLineData);
    return this.http.post(APIEndpoint + ApiUrls.SearchUserStories, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getEmployeeOverview(employeeId: string) {
    let paramsobj = new HttpParams().set('employeeId', employeeId);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsobj
    };
    return this.http.get(APIEndpoint + ApiUrls.GetMyEmployeeDetails, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  uploadProfileImage(uploadProfileImageModel: UploadProfileImageModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(uploadProfileImageModel);
    return this.http.post(APIEndpoint + ApiUrls.UploadProfileImage, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getHistoricalWork(HistoricalWorkReportModel: HistoricalWorkReportModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(HistoricalWorkReportModel);
    return this.http.post(APIEndpoint + ApiUrls.GetUserHistoricalWorkReport, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getEmployeeLogTimeDetailsReport(HistoricalWorkReportModel: HistoricalWorkReportModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(HistoricalWorkReportModel);
    return this.http.post(APIEndpoint + ApiUrls.GetEmployeeLogTimeDetailsReport, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getUsersSpentTimeDetailsReport(HistoricalWorkReportModel: HistoricalWorkReportModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(HistoricalWorkReportModel);
    return this.http.post(APIEndpoint + ApiUrls.GetUsersSpentTimeDetailsReport, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getWorkItemsDetailsReport(HistoricalWorkReportModel: HistoricalWorkReportModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(HistoricalWorkReportModel);
    return this.http.post(APIEndpoint + ApiUrls.GetWorkItemsDetailsReport, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertProfileDetails(profileModel: ProfileModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(profileModel);
    return this.http.post(APIEndpoint + ApiUrls.UpsertUserProfileDetails, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

}