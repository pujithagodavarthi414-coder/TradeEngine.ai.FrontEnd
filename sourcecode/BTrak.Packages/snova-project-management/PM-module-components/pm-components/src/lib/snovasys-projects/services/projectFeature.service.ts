import { Injectable } from "@angular/core";
import {
  HttpHeaders,
  HttpResponse,
  HttpClient,
  HttpParams
} from "@angular/common/http";
import { map } from "rxjs/operators";
import { GetProjectFeatureByIdCompleted } from "../store/actions/project-features.actions";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { UserModel } from '../models/user';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { ProjectFeature } from '../models/projectFeature';
import { Observable } from "rxjs";
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: "root"
})
export class ProjectFeatureService {
  constructor(private http: HttpClient) {}
  
  GetAllUsers(usermodel: UserModel) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "my-auth-token"
      })
    };

    if (usermodel.pageSize == undefined) {
      usermodel.pageSize = 10;
    }
    
    let body = JSON.stringify(usermodel);
    return this.http
      .post(`${APIEndpoint + ApiUrls.GetAllUsers}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  GetAllProjectFeatures(projectFeatureModel: ProjectFeature) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
   
    let body = JSON.stringify(projectFeatureModel);
    return this.http
      .post<any[]>(`${APIEndpoint + ApiUrls.GetAllProjectFeaturesByProjectId}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  UpsertProjectFeature(projectFeatureModel: ProjectFeature) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(projectFeatureModel);
    return this.http
      .post(`${APIEndpoint + ApiUrls.UpsertProjectFeature}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  
getProjectFeatureById(projectFeatureId:string){
  let paramsobj = new HttpParams().set("projectFeatureId", projectFeatureId);
  const httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
    params: paramsobj
  };
  return this.http.get(`${APIEndpoint + ApiUrls.GetProjectFeatureById}`, httpOptions);
}
}
