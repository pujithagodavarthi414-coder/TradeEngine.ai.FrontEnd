import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from 'rxjs';

import { map } from "rxjs/operators";

import { ResetModel } from "../models/reset-password-model";
import { UserModel } from "../models/user";

import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';

@Injectable({
  providedIn: "root"
})

export class UserService {
  EditUser: UserModel;
  constructor(private http: HttpClient) { }

  submitPassword(emailId: string) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    let paramsobj = new HttpParams().set('emailId', emailId);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsobj
    };
    return this.http.get(APIEndpoint + `api/LoginApi/ForgotPassword`, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  resetPassword(userId: string) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    let paramsobj = new HttpParams().set('userId', userId);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsobj
    };
    return this.http.get(APIEndpoint + `api/LoginApi/ForgotPassword`, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  getLoggedInUser() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return this.http.get(`${APIEndpoint + `api/LoginApi/GetLoggedInUser`}`, httpOptions).pipe(
      map((result) => {
        return result;
      })
    );
  }

  reset(resetPasswordModel: ResetModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    var data = {
      resetGuid: resetPasswordModel.resetGuid,
      newPassword: resetPasswordModel.newPassword,
      confirmPassword: resetPasswordModel.confirmPassword
    };
    let body = JSON.stringify(data);
    return this.http.post<ResetModel>(APIEndpoint + `api/LoginApi/UpdatePassword`, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  expired(resetGuid: string) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const paramsobj = new HttpParams().set('resetGuid', resetGuid);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsobj
    };
    return this.http.get(APIEndpoint + `api/LoginApi/ResetPassword`, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }
}
