import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { BugPriorityDropDownData } from "../models/bugPriorityDropDown";
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { Observable } from "rxjs";
import { StatusesModel } from '../models/workFlowStatusesModel';
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;
const ApiUrls = {
  GetUserStoryTypeDropDown: 'MasterData/MasterDataManagementApi/GetUserStoryTypeDropDown'
}

@Injectable({
  providedIn: "root"
})
export class ProjectStatusService {
  constructor(private http: HttpClient) {}

  private GET_ALL_BUG_PRIPORITIES =
    APIEndpoint + "Status/BugPriorityApi/GetAllBugPriorities";
  private Get_All_Status_API_PATH = 
    APIEndpoint + "Status/StatusApi/GetAllStatuses";

  GetAllBugPriporities(bugPripority: BugPriorityDropDownData) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(bugPripority);

    return this.http
      .post(`${this.GET_ALL_BUG_PRIPORITIES}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getAllUserStoryTypes(userStoryTypesModel) {
    const paramsObj = new HttpParams().set("isArchived", userStoryTypesModel.isArchived).set("searchText", userStoryTypesModel.searchText);
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      params: paramsObj
    };
 
    return this.http.get(
      `${APIEndpoint + ApiUrls.GetUserStoryTypeDropDown}`,
      httpOptions
    );
  }

  GetAllStatus(workflowInput: StatusesModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(workflowInput);
    return this.http
      .post(`${this.Get_All_Status_API_PATH}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
  
}
