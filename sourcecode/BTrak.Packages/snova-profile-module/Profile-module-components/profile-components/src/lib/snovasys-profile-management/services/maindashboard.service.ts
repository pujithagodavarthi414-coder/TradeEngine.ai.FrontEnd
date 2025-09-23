import { HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, } from '@angular/common/http';
import { map } from "rxjs/operators";
import { WorkAllocationSummary } from "../models/workallocationsummary";
import { UserStoriesOtherDependency } from '../models/userstoriesotherdependency';
import { GoalsArchive } from '../models/goalsarchive';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../../globaldependencies/constants/api-urls';

import { Observable } from "rxjs";
const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root',
})

export class MainDashboardService {
  constructor(private http: HttpClient) { }
  private WorkAllocationSummary_SEARCH_API_PATH = APIEndpoint + ApiUrls.GetEmployeeWorkAllocation;
  private UserstoriesDependencyOnme_SEARCH_API_PATH = APIEndpoint + 'UserStory/UserStoryApi/SearchUserStories';
  private GetGoalsToArchive_SEARCH_API_PATH = APIEndpoint + 'Goals/GoalsApi/GetGoalsToArchive';

  getWorkAllocationSummary(workAllocationSummary: WorkAllocationSummary) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' })
    };
    let body = JSON.stringify(workAllocationSummary);

    return this.http.post(`${this.WorkAllocationSummary_SEARCH_API_PATH}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  GetUserstoriesDependencyOnOthers(userStoriesOtherDependency: UserStoriesOtherDependency) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' })
    };

    if (userStoriesOtherDependency.PageSize == undefined) {
      userStoriesOtherDependency.PageSize = 10;
    }
    var data = { PageNumber: userStoriesOtherDependency.PageNumber, PageSize: userStoriesOtherDependency.PageSize, DependencyText: 'DependencyOnOthers' }
    let body = JSON.stringify(data);

    return this.http.post(`${this.UserstoriesDependencyOnme_SEARCH_API_PATH}`, body, httpOptions)
      .pipe(map(result => {

        return result;
      }));
  }

  GetGoalsToArchive(goalsToArchive: GoalsArchive) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' })
    };

    if (goalsToArchive.PageSize == undefined) {
      goalsToArchive.PageSize = 10;
    }
    var data = { PageNumber: goalsToArchive.PageNumber, PageSize: goalsToArchive.PageSize, SearchText: goalsToArchive.SearchText, SortBy: goalsToArchive.SortBy, SortDirectionAsc: goalsToArchive.SortDirectionAsc }
    let body = JSON.stringify(goalsToArchive);

    return this.http.post(`${this.GetGoalsToArchive_SEARCH_API_PATH}`, body, httpOptions)
      .pipe(map(result => {

        return result;
      }));
  }



  getActivelyRunningProjectGoal(entityId: string) {
    let paramobj = new HttpParams().set("entityId",entityId);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params:paramobj
    };
    return this.http.get<any[]>(APIEndpoint + ApiUrls.GetActivelyRunningProjectGoals, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
  

  
  getActivelyRunningTeamLeadGoals(entityId) {
    let paramObj=new HttpParams().set("entityId",entityId);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params:paramObj
    };
    return this.http.get<any[]>(APIEndpoint + ApiUrls.GetActivelyRunningTeamLeadGoals, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }

  getDrillDownUserStorybyUserId(workAllocationSummary: WorkAllocationSummary) {

    let API_PATH = APIEndpoint + ApiUrls.GetDrillDownUserStorybyUserId;

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'my-auth-token' })
    };
    let body = JSON.stringify(workAllocationSummary);

    return this.http.post(`${API_PATH}`, body, httpOptions)
      .pipe(map(result => {
        return result;
      }));
  }
 
}