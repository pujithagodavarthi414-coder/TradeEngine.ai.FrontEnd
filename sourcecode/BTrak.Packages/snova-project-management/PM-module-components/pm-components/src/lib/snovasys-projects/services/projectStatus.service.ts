import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { ProjectMemberOld } from "../models/projectMember-old";
import { BugPriorityDropDownData } from "../models/bugPriorityDropDown";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { Observable } from "rxjs";
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;


@Injectable({
  providedIn: "root"
})
export class ProjectStatusService {
  constructor(private http: HttpClient) {}

  private GET_ALL_BUG_PRIPORITIES =
    APIEndpoint + "Status/BugPriorityApi/GetAllBugPriorities";

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
}
