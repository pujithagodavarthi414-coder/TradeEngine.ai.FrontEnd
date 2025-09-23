import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

import { UserModel } from "../models/user";
import { ResetModel } from "../models/reset-password-model";
import { RoleSearchCriteriaInputModel } from "../models/roleSearchCriteria";

import { ApiUrls } from "../constants/api-urls";
// import { UserSearchModel } from "../models/user-search-model";
import { EmployeeDetailsHistoryModel } from "../models/employee-details-history.model";
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

@Injectable({
  providedIn: "root"
})

export class UserService {
  constructor(private http: HttpClient) { }
  private UPSERT_USER_API_PATH = "User/UsersApi/UpsertUser";
  private USERS_SEARCH_API_PATH = ApiUrls.GetAllUsers;
  private Get_All_Roles__API_PATH = "Roles/RolesApi/GetAllRoles";
  private GET_COMPANY_START_FUNCTIONALITY_ENABLED = "MasterData/MasterDataManagementApi/GetCompanyWorkItemStartFunctionalityRequired";
  EditUser: UserModel;
  UpsertUser(userModel: UserModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };

    let body = JSON.stringify(userModel);
    return this.http
      .post(`${APIEndpoint + this.UPSERT_USER_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  GetAllUsers(usermodel: UserModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };

    if (usermodel.pageSize == undefined) {
      usermodel.pageSize = 10;
    }
    var data = { PageNo: usermodel.pageNo, PageSize: usermodel.pageSize };
    let body = JSON.stringify(data);
    console.log(data);
    return this.http
      .post(`${APIEndpoint + this.USERS_SEARCH_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  submitPassword(emailId: string) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    let paramsobj = new HttpParams().set('emailId', emailId);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsobj
    };
    return this.http.get(APIEndpoint + ApiUrls.ForgotPassword, httpOptions)
      .pipe(map(result => {
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
    return this.http.get(APIEndpoint + ApiUrls.ForgotPassword, httpOptions)
      .pipe(map(result => {
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
    return this.http.get(`${APIEndpoint + ApiUrls.GetLoggedInUser}`, httpOptions).pipe(
      map(result => {
        return result;
      })
    );
  }

  getTeamLeadsList() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post(`${APIEndpoint + ApiUrls.GetMyTeamMembersList}`, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }


  getCompanyWorkItemStartFunctionalityRequired() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    return this.http.get(`${APIEndpoint + ApiUrls.GET_COMPANY_START_FUNCTIONALITY_ENABLED}`, httpOptions).pipe(
      map(result => {
        return result;
      })
    );
  }

  getAllRoles() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    var roleSearchCriteriaModel = new RoleSearchCriteriaInputModel();
    var data = { RoleId: null, RoleName: null, Data: null };
    console.log(data);
    let body = JSON.stringify(data);

    return this.http
      .post(`${APIEndpoint + this.Get_All_Roles__API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
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
    return this.http.post<ResetModel>(APIEndpoint + ApiUrls.UpdatePassword, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  expired(resetGuid: string) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    let paramsobj = new HttpParams().set('resetGuid', resetGuid);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: paramsobj
    };
    return this.http.get(APIEndpoint + ApiUrls.ResetPassword, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getUsersDropDown(searchText: string) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    let paramsobj = new HttpParams().set('searchText', searchText);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' }),
      params: paramsobj
    };
    return this.http.get(APIEndpoint + ApiUrls.GetUsersDropDown, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }


  getEmployeeDetailsHistory(employeeModel: EmployeeDetailsHistoryModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(employeeModel);

    return this.http.post(APIEndpoint + ApiUrls.GetEmployeeDetailsHistory , body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getEmployeesByRoleId(roleIds: string) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = JSON.stringify(roleIds);
    return this.http.post(APIEndpoint + ApiUrls.GetEmployeesByRoleId, body,httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

}
