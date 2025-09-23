import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { ProjectType } from "../models/projectType";
import { ApiUrls } from '../../globaldependencies/constants/api-urls';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { Observable } from "rxjs";
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: "root"
})
export class ProjectTypeService {
  private GETALL_PROJECTTYPES_API_PATH =
    APIEndpoint + ApiUrls.GetAllProjectTypes;

  constructor(private http: HttpClient) {}

  GetAllProjectTypes(projectType:ProjectType) {
    var data = {
      ProjectTypeName: "",
      IsArchived: projectType.isArchived,
      ProjectTypeId: ""
    };

    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(data);
    return this.http.post(
      `${this.GETALL_PROJECTTYPES_API_PATH}`,
      body,
      httpOptions
    );
  }
}
