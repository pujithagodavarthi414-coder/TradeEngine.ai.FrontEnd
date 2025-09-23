import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { BugPriorityDropDownData } from "../models/bugPriorityDropDown";
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ProjectStatusService {
  constructor(private http: HttpClient) {}

  private GET_ALL_BUG_PRIPORITIES =
    "Status/BugPriorityApi/GetAllBugPriorities";

  GetAllBugPriporities(bugPripority: BugPriorityDropDownData) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(bugPripority);

    return this.http
      .post(`${APIEndpoint + this.GET_ALL_BUG_PRIPORITIES}`, body, httpOptions)
      .pipe(
        map(result => {
          return result;
        })
      );
  }
}
