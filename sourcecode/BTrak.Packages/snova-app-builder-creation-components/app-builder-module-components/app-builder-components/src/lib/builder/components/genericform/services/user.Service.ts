import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable"; 
import { map } from "rxjs/operators";

import { UserModel } from "../models/user";

import { ApiUrls } from "../../../../globaldependencies/constants/api-urls";
import { LocalStorageProperties } from "../../../../globaldependencies/constants/localstorage-properties";
import { GenericFormSubmitted } from "../models/generic-form-submitted.model";


const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;


@Injectable({
  providedIn: "root"
})

export class UserService {
  constructor(private http: HttpClient) { }
  private UPSERT_USER_API_PATH = APIEndpoint + "User/UsersApi/UpsertUser";
  // private USERS_SEARCH_API_PATH = APIEndpoint + ApiUrls.GetAllUsers;
   private USERS_SEARCH_API_PATH = APIEndpoint + "User/UsersApi/GetAllUsers";
  
  private CANDIDATE_SEARCH_DROPDOWN = APIEndpoint + "Recruitment/RecruitmentMasterDataApi/GetCandidateRegistrationDropDown";
  private CANDIDATE_REGISTER = APIEndpoint + "Recruitment/RecruitmentApi/UpsertCandidateFormSubmitted";
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

  GetUsersDropDown() {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    let body = JSON.stringify({});
    return this.http
      .post(`${this.USERS_SEARCH_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }





  // GetAllUsers(usermodel: UserModel) {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       "Content-Type": "application/json"
  //     })
  //   };

  //   if (usermodel.pageSize == undefined) {
  //     usermodel.pageSize = 10;
  //   }
  //   var data = {PageNo: usermodel.pageNo, PageSize: usermodel.pageSize };
  //   let body = JSON.stringify(data);
  //   console.log(data);
  //   return this.http
  //     .post(`${this.USERS_SEARCH_API_PATH}`, body, httpOptions)
  //     .pipe(
  //       map(result => {
  //         return result;
  //       })
  //     );
  // }


   GetAllUsers(data:any){
    const httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };

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

  getDropDownLists(data: any){
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    let body = JSON.stringify(data);
    return this.http
      .post(`${this.CANDIDATE_SEARCH_DROPDOWN}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  upsertCandidateFormSubmitted(genericFormSubmitted: GenericFormSubmitted){
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    let body = JSON.stringify(genericFormSubmitted);
    return this.http
      .post(`${this.CANDIDATE_REGISTER}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  
}
