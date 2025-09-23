import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
// import { environment } from "../../../globaldependencies/environments/environment";
import { GenericFormSubmitted } from "../models/generic-form-submitted.model";
import { RoleSearchCriteriaInputModel } from "../models/roleSearchCriteria";
import { Observable } from "rxjs/Observable"
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';

// const APIEndpoint = environment.apiURL;
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

const ApiUrls = {
  GetGenericFormSubmitted: `GenericForm/GenericFormApi/GetGenericFormSubmitted`,
  // GetAllRoles: `Roles/RolesApi/GetAllRoles`
  GetAllRolesDropDown: "Roles/RolesApi/GetAllRolesDropDown",
  GetAllUsers: `User/UsersApi/GetAllUsers`
}

@Injectable({
  providedIn: "root"
})

export class GenericFormService {

  private Get_All_Users = APIEndpoint + ApiUrls.GetAllUsers;
  constructor(private http: HttpClient) { 
    
  }

  getAllRoles() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    // let body = JSON.stringify(roleSearchCriteriaModel);

    return this.http.get(APIEndpoint + ApiUrls.GetAllRolesDropDown, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getSubmittedReportByFormReportId(genericForm: GenericFormSubmitted) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    const body = JSON.stringify(genericForm);
    return this.http.post(APIEndpoint + ApiUrls.GetGenericFormSubmitted, body, httpOptions)
      .pipe(map((result) => {
        return result;
      }));
  }

  GetAllUsers(searchModel) {
    const httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(searchModel);
    return this.http.post(`${this.Get_All_Users}`, body, httpOptions)
        .pipe(map((result) => {
            return result;
        }));
}

}
