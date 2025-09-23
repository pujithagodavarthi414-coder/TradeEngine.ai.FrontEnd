import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrls } from '../constants/api-urls';
import { ProjectType } from '../models/projectType';
import { GoalReplanModel } from '../models/goalReplanModel';
import { UserstorySubTypeModel } from '../models/user-story-sub-type-model';
import { BugPriorityModel } from '../models/bug-priority-model';
import { UserStoryReplanTypeModel } from '../models/user-story-repaln-type-model';
import { UserStoryStatusModel } from '../models/user-story-status-model';
import { UserstoryTypeModel } from '../models/user-story-type-model';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
import { Observable } from "rxjs";
import { UserStory } from '../models/userStory';

@Injectable({
  providedIn: 'root',
})

export class ProjectsService {
  constructor(private http: HttpClient) { }

  private Upsert_Project_Type = ApiUrls.UpsertProjectType;
  private Upsert_UserStory_Type = ApiUrls.UpsertUserStoryType;
  private GoalReplan_Type = ApiUrls.UpsertGoalReplanType;
  private Get_All_UserstorySubTypes = ApiUrls.SearchUserStorySubTypes;
  private Upsert_Userstory_sub_type = ApiUrls.UpsertUserStorySubType;
  private Upsert_Bug_Priority = ApiUrls.UpsertBugPriority;
  private Get_UserStory_Replan_Types = ApiUrls.GetUserStoryReplanTypes;
  private Upsert_UserStoryReplanType = ApiUrls.UpsertUserStoryReplanType;
  private Delete_UserStory_Type = ApiUrls.DeleteUserStoryType;


  searchAllWorkItems(userStory: UserStory) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userStory);

    return this.http.post(`${APIEndpoint + ApiUrls.SearchWorkItemsByLoggedInId}`, body, httpOptions);
  }
  
  upsertProjectType(projectType: ProjectType) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(projectType);

    return this.http.post(APIEndpoint + this.Upsert_Project_Type, body, httpOptions);
  }

  upsertGoalReplanType(goalReplanType: GoalReplanModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(goalReplanType);

    return this.http.post(APIEndpoint + this.GoalReplan_Type, body, httpOptions);
  }

  SearchUserstorySubTypes(userstorySubType: UserstorySubTypeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userstorySubType);

    return this.http.post(APIEndpoint + this.Get_All_UserstorySubTypes, body, httpOptions);
  }

  upsertUserstorySubTypeType(userStorySubTypeModel: UserstorySubTypeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userStorySubTypeModel);

    return this.http.post(APIEndpoint + this.Upsert_Userstory_sub_type, body, httpOptions);
  }

  upsertBugPriority(bugPriority: BugPriorityModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(bugPriority);

    return this.http.post(APIEndpoint + this.Upsert_Bug_Priority, body, httpOptions);
  } //GetUserStoryReplanTypes

  GettAllUserStoryReplanTypes(userStoryReplanTypeModel : UserStoryReplanTypeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userStoryReplanTypeModel);

    return this.http.post(APIEndpoint + this.Get_UserStory_Replan_Types,body, httpOptions);
  }

  upsertUserStoryReplanType(userStoryReplanType: UserStoryReplanTypeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userStoryReplanType);

    return this.http.post(APIEndpoint + this.Upsert_UserStoryReplanType, body, httpOptions);
  }

  SearchUserstoryStatuses(userStoryStatusModel: UserStoryStatusModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userStoryStatusModel);

    return this.http.post(APIEndpoint+ApiUrls.GetAllStatuses, body, httpOptions);
  }

  SearchTaskStatuses() {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.post(APIEndpoint+ApiUrls.GetAllTaskStatuses, httpOptions);
  }

  upsertUserstoryStatus(userStoryStatusModel: UserStoryStatusModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userStoryStatusModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertStatus, body, httpOptions);
  }

  SearchUserStoryTypes(userstoryType: UserstoryTypeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userstoryType);

    return this.http.post(APIEndpoint + ApiUrls.GetUserStoryTypes, body, httpOptions);
  }

  upsertUserStoryType(userstoryTypeModel: UserstoryTypeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userstoryTypeModel);

    return this.http.post(APIEndpoint + this.Upsert_UserStory_Type, body, httpOptions);
  }

  deleteUserStoryType(userstoryTypeModel: UserstoryTypeModel) {
    let environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
    let APIEndpoint = environment.apiURL;
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userstoryTypeModel);

    return this.http.post(APIEndpoint + this.Delete_UserStory_Type, body, httpOptions);
  }

}