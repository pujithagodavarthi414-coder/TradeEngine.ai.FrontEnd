import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ButtonTypeInputModel } from '../models/button-type-input-model';
import { FeedbackTypeInputModel } from '../models/feedback-type-model';
import { PermissionReasonModel } from '../models/permission-reason-model';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../constants/api-urls';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;


@Injectable({
  providedIn: 'root',
})

export class TimeSheetManagementService {
  constructor(private http: HttpClient) { }

  private GET_All_ButtonTypes = APIEndpoint + ApiUrls.GetAllButtonTypes;
  private GET_All_PermissionReasons = APIEndpoint + ApiUrls.GetAllPermissionReasons;
  private GET_ALL_FeedbackTypes = APIEndpoint + ApiUrls.GetFeedbackTypes;
  private Upsert_Feedback_Types = APIEndpoint + ApiUrls.UpsertFeedbackForm;
  private Upsert_ButtonType = APIEndpoint + ApiUrls.UpsertButtonType;
  private Upsert_PermissionReasons = APIEndpoint + ApiUrls.UpsertTimeSheetPermissionReasons;
  

  getButtonTypeDetails(buttonTypeInputModel: ButtonTypeInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(buttonTypeInputModel);

    return this.http.post(`${this.GET_All_ButtonTypes}`, body, httpOptions);
  }

  getAllPermissionReasons(permissionReasonModel: PermissionReasonModel) {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(permissionReasonModel);

    return this.http.post(this.GET_All_PermissionReasons, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertPermissionReasons(permissionReasonModel: PermissionReasonModel) {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(permissionReasonModel);

    return this.http.post(this.Upsert_PermissionReasons, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getFeedBackType(feedbackTypeModel: FeedbackTypeInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(feedbackTypeModel);

    return this.http.post(this.GET_ALL_FeedbackTypes, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertButtonType(buttonTypeModel: ButtonTypeInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(buttonTypeModel);

    return this.http.post(this.Upsert_ButtonType, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  upsertFeedBackType(feedbackTypeModel: FeedbackTypeInputModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(feedbackTypeModel);

    return this.http.post(this.Upsert_Feedback_Types, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
}