import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";

import { UserModel } from "../models/user";
import { ResetModel } from "../models/reset-password-model";
import { RoleSearchCriteriaInputModel } from "../models/roleSearchCriteria";

import { EmployeeDetailsHistoryModel } from "../models/employee-details-history.model";
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { Observable } from 'rxjs';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));

const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: "root"
})

export class UserService {
  constructor(private http: HttpClient) { }
  private UPSERT_USER_API_PATH = APIEndpoint + "User/UsersApi/UpsertUser";
  private USERS_SEARCH_API_PATH = APIEndpoint + ApiUrls.GetAllUsers;
  private Get_All_Roles__API_PATH = APIEndpoint + "Roles/RolesApi/GetAllRoles";
  private GET_COMPANY_START_FUNCTIONALITY_ENABLED = APIEndpoint + "MasterData/MasterDataManagementApi/GetCompanyWorkItemStartFunctionalityRequired";
  EditUser: UserModel;
  UpsertUser(userModel: UserModel) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };

    let body = JSON.stringify(userModel);
    return this.http
      .post(`${this.UPSERT_USER_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  GetAllUsers(usermodel: UserModel) {
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
      .post(`${this.USERS_SEARCH_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  submitPassword(emailId: string) {
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
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post(`${APIEndpoint + ApiUrls.GetMyTeamMembersList}`, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }


  getCompanyWorkItemStartFunctionalityRequired() {
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
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    var roleSearchCriteriaModel = new RoleSearchCriteriaInputModel();
    var data = { RoleId: null, RoleName: null, Data: null };
    console.log(data);
    let body = JSON.stringify(data);

    return this.http
      .post(`${this.Get_All_Roles__API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  reset(resetPasswordModel: ResetModel) {
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
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    let body = JSON.stringify(employeeModel);

    return this.http.post(APIEndpoint + ApiUrls.GetEmployeeDetailsHistory , body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

}
