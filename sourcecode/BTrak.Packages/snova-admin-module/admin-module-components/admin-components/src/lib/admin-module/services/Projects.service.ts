import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { ApiUrls } from '../constants/api-urls';
import { ProjectType } from '../models/projects/projectType';
import { GoalReplanModel } from '../models/projects/goalReplanModel';
import { UserstorySubTypeModel } from '../models/projects/user-story-sub-type-model';
import { BugPriorityModel } from '../models/projects/bug-priority-model';
import { UserStoryReplanTypeModel } from '../models/projects/user-story-repaln-type-model';
import { UserStoryStatusModel } from '../models/projects/user-story-status-model';
import { UserstoryTypeModel } from '../models/projects/user-story-type-model';
import { Observable } from "rxjs";

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;

@Injectable({
  providedIn: 'root',
})

export class ProjectsService {
  constructor(private http: HttpClient) { }

  private Upsert_Project_Type = APIEndpoint + ApiUrls.UpsertProjectType;
  private Upsert_UserStory_Type = APIEndpoint + ApiUrls.UpsertUserStoryType;
  private GoalReplan_Type = APIEndpoint + ApiUrls.UpsertGoalReplanType;
  private Get_All_UserstorySubTypes = APIEndpoint + ApiUrls.SearchUserStorySubTypes;
  private Upsert_Userstory_sub_type = APIEndpoint + ApiUrls.UpsertUserStorySubType;
  private Upsert_Bug_Priority=APIEndpoint+ApiUrls.UpsertBugPriority;
  private Get_UserStory_Replan_Types = APIEndpoint + ApiUrls.GetUserStoryReplanTypes;
  private Upsert_UserStoryReplanType= APIEndpoint+ApiUrls.UpsertUserStoryReplanType;
  private Delete_UserStory_Type = APIEndpoint+ApiUrls.DeleteUserStoryType;

  upsertProjectType(projectType: ProjectType) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(projectType);

    return this.http.post(this.Upsert_Project_Type, body, httpOptions);
  }

  upsertGoalReplanType(goalReplanType: GoalReplanModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(goalReplanType);

    return this.http.post(this.GoalReplan_Type, body, httpOptions);
  }

  SearchUserstorySubTypes(userstorySubType: UserstorySubTypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userstorySubType);

    return this.http.post(this.Get_All_UserstorySubTypes, body, httpOptions);
  }

  upsertUserstorySubTypeType(userStorySubTypeModel: UserstorySubTypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userStorySubTypeModel);

    return this.http.post(this.Upsert_Userstory_sub_type, body, httpOptions);
  }

  upsertBugPriority(bugPriority: BugPriorityModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(bugPriority);

    return this.http.post(this.Upsert_Bug_Priority, body, httpOptions);
  } //GetUserStoryReplanTypes

  GettAllUserStoryReplanTypes(userStoryReplanTypeModel : UserStoryReplanTypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userStoryReplanTypeModel);

    return this.http.post(this.Get_UserStory_Replan_Types,body, httpOptions);
  }

  upsertUserStoryReplanType(userStoryReplanType: UserStoryReplanTypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userStoryReplanType);

    return this.http.post(this.Upsert_UserStoryReplanType, body, httpOptions);
  }

  SearchUserstoryStatuses(userStoryStatusModel: UserStoryStatusModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userStoryStatusModel);

    return this.http.post(APIEndpoint+ApiUrls.GetAllStatuses, body, httpOptions);
  }

  SearchTaskStatuses() {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    return this.http.post(APIEndpoint+ApiUrls.GetAllTaskStatuses, httpOptions);
  }

  upsertUserstoryStatus(userStoryStatusModel: UserStoryStatusModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userStoryStatusModel);

    return this.http.post(APIEndpoint + ApiUrls.UpsertStatus, body, httpOptions);
  }

  SearchUserStoryTypes(userstoryType: UserstoryTypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userstoryType);

    return this.http.post(APIEndpoint + ApiUrls.GetUserStoryTypes, body, httpOptions);
  }

  upsertUserStoryType(userstoryTypeModel: UserstoryTypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userstoryTypeModel);

    return this.http.post(this.Upsert_UserStory_Type, body, httpOptions);
  }

  deleteUserStoryType(userstoryTypeModel: UserstoryTypeModel) {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    let body = JSON.stringify(userstoryTypeModel);

    return this.http.post(this.Delete_UserStory_Type, body, httpOptions);
  }

}