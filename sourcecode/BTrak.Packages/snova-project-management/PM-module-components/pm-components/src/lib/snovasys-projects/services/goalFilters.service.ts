import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { UserGoalFilter } from "../models/user-goal-filter.model";
import { ArchivedGoalFilter } from "../models/archived-goal-filter.model";
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;


@Injectable({
  providedIn: "root"
})
export class GoalsFilterService {
    constructor(private http: HttpClient) { }

  upsertGoalFilters(goalFilter: UserGoalFilter) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(goalFilter);

    return this.http.post<any[]>(
      `${APIEndpoint + ApiUrls.UpsertGoalFilters}`,
      body,
      httpOptions
    );
  }

  searchGoalsFiltets(goalFilterModel : UserGoalFilter) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(goalFilterModel);
    return this.http.post<any[]>(
      `${APIEndpoint + ApiUrls.GetGoalFiltersList}`,
      body,
      httpOptions
    );
  }

  archiveGoalsFiltets(archiveGoalFilterModel : ArchivedGoalFilter) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
    let body = JSON.stringify(archiveGoalFilterModel);
    return this.http.post<any[]>(
      `${APIEndpoint + ApiUrls.ArchiveGoalFilter}`,
      body,
      httpOptions
    );
  }
}